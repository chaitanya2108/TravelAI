import styles from "../app/page.module.css";

interface Place {
  name: string;
  type: string;
  rating: number;
  address: string;
  phone?: string;
  maps_url?: string;
  website?: string;
}

interface ItineraryDay {
  [key: string]: Place[];
}

interface ItineraryData {
  destination: string;
  start_date: string;
  end_date: string;
  budget: number;
  itinerary: ItineraryDay;
}

interface ItineraryDisplayProps {
  itinerary: {
    response: ItineraryData;
  };
}

export const ItineraryDisplay = ({ itinerary }: ItineraryDisplayProps) => {
  const startDate = new Date(itinerary.response.start_date);
  const endDate = new Date(itinerary.response.end_date);
  const duration =
    Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 3600 * 24)) +
    1;

  return (
    <div className={styles.resultContainer}>
      <h2 className={styles.resultTitle}>Your Travel Itinerary</h2>

      <div className={styles.tripSummary}>
        <h3>Trip Overview</h3>
        <p>
          <strong>Destination:</strong> {itinerary.response.destination}
        </p>
        <p>
          <strong>Duration:</strong> {duration} days
        </p>
        <p>
          <strong>Start Date:</strong>{" "}
          {new Date(itinerary.response.start_date).toLocaleDateString()}
        </p>
        <p>
          <strong>Budget:</strong> ${itinerary.response.budget}
        </p>
      </div>

      <div className={styles.itineraryDays}>
        {Object.entries(itinerary.response.itinerary).map(([day, places]) => (
          <div key={day} className={styles.dayCard}>
            <h3 className={styles.dayTitle}>{day}</h3>
            <div className={styles.placesGrid}>
              {places.map((place: Place, index: number) => (
                <PlaceCard key={index} place={place} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

interface PlaceCardProps {
  place: Place;
}

const PlaceCard = ({ place }: PlaceCardProps) => (
  <div className={styles.placeCard}>
    <h4 className={styles.placeName}>{place.name}</h4>
    <div className={styles.placeDetails}>
      <p className={styles.placeType}>
        <span className={styles.label}>Type:</span> {place.type}
      </p>
      <p className={styles.placeRating}>
        <span className={styles.label}>Rating:</span> {place.rating} ⭐
      </p>
      <p className={styles.placeAddress}>
        <span className={styles.label}>Address:</span> {place.address}
      </p>
      {place.phone && (
        <p className={styles.placePhone}>
          <span className={styles.label}>Phone:</span> {place.phone}
        </p>
      )}
      <div className={styles.placeLinks}>
        {place.maps_url && (
          <a
            href={place.maps_url}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.placeLink}
          >
            View on Google Maps
          </a>
        )}
        {place.website && (
          <a
            href={place.website}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.placeLink}
          >
            Visit Website
          </a>
        )}
      </div>
    </div>
  </div>
);
