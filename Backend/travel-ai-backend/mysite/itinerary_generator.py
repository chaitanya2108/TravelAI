import googlemaps
from datetime import datetime, timedelta
from django.conf import settings
import random
import json

class ItineraryGenerator:
    def __init__(self):
        self.gmaps = googlemaps.Client(key=settings.GOOGLE_MAPS_API_KEY)

    def get_places_by_type(self, location, place_type, radius=5000):
        """Search for places of a specific type near the location"""
        try:
            result = self.gmaps.places_nearby(
                location=location,
                radius=radius,
                type=place_type
            )
            return result.get('results', [])
        except Exception as e:
            print(f"Error fetching {place_type}: {str(e)}")
            return []

    def get_location_coordinates(self, destination):
        """Get latitude and longitude for a destination"""
        try:
            geocode_result = self.gmaps.geocode(destination)
            if geocode_result:
                location = geocode_result[0]['geometry']['location']
                return location
            return None
        except Exception as e:
            print(f"Error geocoding: {str(e)}")
            return None

    def get_place_details(self, place_id):
        """Get additional details for a place"""
        try:
            details = self.gmaps.place(place_id, fields=['url', 'website', 'formatted_phone_number', 'opening_hours'])
            return {
                'maps_url': details.get('result', {}).get('url', ''),
                'website': details.get('result', {}).get('website', ''),
                'phone': details.get('result', {}).get('formatted_phone_number', ''),
                'opening_hours': details.get('result', {}).get('opening_hours', {})
            }
        except Exception as e:
            print(f"Error fetching place details: {str(e)}")
            return {}

    def generate_daily_itinerary(self, location, activities, date_str):
        """Generate a single day's itinerary based on selected activities"""
        daily_places = []
        places_per_activity = 2

        activity_type_mapping = {
            'Sightseeing': ['tourist_attraction', 'point_of_interest'],
            'Museums': ['museum'],
            'Food & Dining': ['restaurant'],
            'Shopping': ['shopping_mall'],
            'Nature': ['park', 'natural_feature'],
            'Adventure': ['amusement_park'],
            'Relaxation': ['spa'],
            'Cultural': ['art_gallery', 'church']
        }

        for activity in activities:
            if activity in activity_type_mapping:
                place_types = activity_type_mapping[activity]
                for place_type in place_types:
                    places = self.get_places_by_type(location, place_type)
                    if places:
                        selected_places = random.sample(
                            places,
                            min(places_per_activity, len(places))
                        )
                        for place in selected_places:
                            details = self.get_place_details(place['place_id'])
                            daily_places.append({
                                'name': place['name'],
                                'address': place.get('vicinity', 'Address not available'),
                                'rating': place.get('rating', 'No rating'),
                                'type': activity,
                                'maps_url': details.get('maps_url', ''),
                                'website': details.get('website', ''),
                                'phone': details.get('phone', ''),
                                'date': date_str,
                                'price_level': place.get('price_level', 'N/A'),
                                'opening_hours': details.get('opening_hours', {})
                            })

        return daily_places

    def create_itinerary(self, data):
        """Create a full itinerary based on user input"""
        try:
            # Extract and validate input data
            destination = data.get('destination')
            if not destination:
                raise ValueError("Destination is required")

            # Validate dates
            try:
                start_date = datetime.strptime(str(data.get('start_date', '')), '%Y-%m-%d')
                end_date = datetime.strptime(str(data.get('end_date', '')), '%Y-%m-%d')
            except ValueError:
                raise ValueError("Invalid date format. Use YYYY-MM-DD")

            if end_date < start_date:
                raise ValueError("End date must be after start date")

            activities = data.get('activities', [])
            if not activities:
                raise ValueError("At least one activity must be selected")

            budget = data.get('budget')
            if not budget:
                raise ValueError("Budget is required")

            # Get location coordinates
            location = self.get_location_coordinates(destination)
            if not location:
                raise ValueError(f"Could not find coordinates for {destination}")

            # Calculate duration and generate itinerary
            duration = (end_date - start_date).days + 1
            itinerary = {}

            for day in range(duration):
                current_date = start_date + timedelta(days=day)
                date_str = current_date.strftime('%Y-%m-%d')
                daily_places = self.generate_daily_itinerary(location, activities, date_str)
                itinerary[f"Day {day + 1} ({date_str})"] = daily_places

            # Prepare response
            return {
                'destination': destination,
                'start_date': start_date.strftime('%Y-%m-%d'),
                'end_date': end_date.strftime('%Y-%m-%d'),
                'duration': duration,
                'budget': budget,
                'activities': activities,
                'itinerary': itinerary
            }

        except KeyError as e:
            raise ValueError(f"Missing required field: {str(e)}")
        except ValueError as e:
            raise ValueError(str(e))
        except Exception as e:
            raise Exception(f"Error generating itinerary: {str(e)}")