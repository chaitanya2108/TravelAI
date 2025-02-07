import googlemaps
from datetime import datetime, timedelta
from django.conf import settings
import random

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
            details = self.gmaps.place(place_id, fields=['url', 'website', 'formatted_phone_number'])
            return {
                'maps_url': details.get('result', {}).get('url', ''),
                'website': details.get('result', {}).get('website', ''),
                'phone': details.get('result', {}).get('formatted_phone_number', '')
            }
        except Exception as e:
            print(f"Error fetching place details: {str(e)}")
            return {}

    def generate_daily_itinerary(self, location, activities):
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
                            # Get additional details for each place
                            details = self.get_place_details(place['place_id'])
                            daily_places.append({
                                'name': place['name'],
                                'address': place.get('vicinity', 'Address not available'),
                                'rating': place.get('rating', 'No rating'),
                                'type': activity,
                                'maps_url': details.get('maps_url', ''),
                                'website': details.get('website', ''),
                                'phone': details.get('phone', ''),
                                'photos': place.get('photos', [])[:1],  # Get first photo if available
                                'price_level': place.get('price_level', 'N/A')
                            })

        return daily_places

    def create_itinerary(self, data):
        """Create a full itinerary based on user input"""
        destination = data['destination']
        start_date = datetime.strptime(data['start_date'], '%Y-%m-%d')
        duration = int(data['duration'])
        activities = data['activities']

        location = self.get_location_coordinates(destination)
        if not location:
            return {'error': 'Could not find location'}

        itinerary = {}

        for day in range(duration):
            current_date = start_date + timedelta(days=day)
            date_str = current_date.strftime('%Y-%m-%d')
            daily_places = self.generate_daily_itinerary(location, activities)
            itinerary[f"Day {day + 1} ({date_str})"] = daily_places

        return {
            'destination': destination,
            'start_date': data['start_date'],
            'duration': duration,
            'budget': data['budget'],
            'activities': activities,
            'preferences': data['preferences'],
            'itinerary': itinerary
        }