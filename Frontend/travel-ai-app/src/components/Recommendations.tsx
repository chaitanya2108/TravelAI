import styles from "./Recommendations.module.css";

interface Destination {
  name: string;
  image: string;
  description: string;
  activities: string[];
}

const recommendedDestinations: Destination[] = [
  {
    name: "Paris, France",
    image: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34",
    description:
      "The City of Light offers iconic landmarks, world-class cuisine, and unparalleled art.",
    activities: ["Museums", "Food & Dining", "Cultural", "Sightseeing"],
  },
  {
    name: "Tokyo, Japan",
    image: "https://images.unsplash.com/photo-1503899036084-c55cdd92da26",
    description:
      "A fascinating blend of ultra-modern and traditional, with amazing food and culture.",
    activities: ["Food & Dining", "Shopping", "Cultural", "Sightseeing"],
  },
  {
    name: "Bali, Indonesia",
    image: "https://images.unsplash.com/photo-1537996194471-e657df975ab4",
    description:
      "Paradise island with beautiful beaches, temples, and vibrant culture.",
    activities: ["Nature", "Relaxation", "Cultural", "Adventure"],
  },
  {
    name: "New York City, USA",
    image: "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9",
    description:
      "The Big Apple offers endless entertainment, culture, and iconic sights.",
    activities: ["Shopping", "Food & Dining", "Museums", "Sightseeing"],
  },
];

export const Recommendations = () => {
  return (
    <div className={styles.recommendationsContainer}>
      <h2 className={styles.sectionTitle}>Popular Destinations</h2>
      <div className={styles.destinationsGrid}>
        {recommendedDestinations.map((destination) => (
          <div key={destination.name} className={styles.destinationCard}>
            <div className={styles.imageContainer}>
              <img
                src={destination.image}
                alt={destination.name}
                className={styles.destinationImage}
              />
            </div>
            <div className={styles.destinationInfo}>
              <h3 className={styles.destinationName}>{destination.name}</h3>
              <p className={styles.destinationDescription}>
                {destination.description}
              </p>
              <div className={styles.activitiesTags}>
                {destination.activities.map((activity) => (
                  <span key={activity} className={styles.activityTag}>
                    {activity}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
