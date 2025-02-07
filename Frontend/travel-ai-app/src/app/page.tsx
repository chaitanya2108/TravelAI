"use client";
import { useState } from "react";
import styles from "./page.module.css";

export default function Home() {
  const [loading, setLoading] = useState(false);
  const [itinerary, setItinerary] = useState<any>(null);
  const [inputValue, setInputValue] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const activities = Array.from(formData.getAll("activities"));

    const data = {
      destination: formData.get("destination"),
      start_date: formData.get("startDate"),
      duration: formData.get("duration"),
      budget: formData.get("budget"),
      activities: activities,
      preferences: formData.get("preferences"),
    };

    try {
      const response = await fetch("http://localhost:8000/api/process-input/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const responseData = await response.json();
      setItinerary(responseData);
      console.log("Response:", responseData.response);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const responseDisplay = itinerary && (
    <div className={styles.resultContainer}>
      <h2 className={styles.resultTitle}>Your Travel Itinerary</h2>

      <div className={styles.tripSummary}>
        <h3>Trip Overview</h3>
        <p>
          <strong>Destination:</strong> {itinerary.response.destination}
        </p>
        <p>
          <strong>Duration:</strong> {itinerary.response.duration} days
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
        {Object.entries(itinerary.response.itinerary).map(
          ([day, places]: [string, any]) => (
            <div key={day} className={styles.dayCard}>
              <h3 className={styles.dayTitle}>{day}</h3>
              <div className={styles.placesGrid}>
                {places.map((place: any, index: number) => (
                  <div key={index} className={styles.placeCard}>
                    <h4 className={styles.placeName}>{place.name}</h4>
                    <div className={styles.placeDetails}>
                      <p className={styles.placeType}>
                        <span className={styles.label}>Type:</span> {place.type}
                      </p>
                      <p className={styles.placeRating}>
                        <span className={styles.label}>Rating:</span>{" "}
                        {place.rating} ⭐
                      </p>
                      <p className={styles.placeAddress}>
                        <span className={styles.label}>Address:</span>{" "}
                        {place.address}
                      </p>
                      {place.phone && (
                        <p className={styles.placePhone}>
                          <span className={styles.label}>Phone:</span>{" "}
                          {place.phone}
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
                ))}
              </div>
            </div>
          )
        )}
      </div>
    </div>
  );

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.title}>Travel Itinerary Generator</h1>
        <p className={styles.subtitle}>Plan your perfect trip in minutes</p>
      </header>

      <main className={styles.main}>
        <div className={styles.formContainer}>
          <form className={styles.form} onSubmit={handleSubmit}>
            <div className={styles.formGroup}>
              <label htmlFor="destination" className={styles.label}>
                Destination
              </label>
              <input
                type="text"
                id="destination"
                name="destination"
                placeholder="e.g., Paris, France"
                className={styles.input}
                required
              />
            </div>

            <div className={styles.formGroupGrid}>
              <div className={styles.formGroup}>
                <label htmlFor="startDate" className={styles.label}>
                  Start Date
                </label>
                <input
                  type="date"
                  id="startDate"
                  name="startDate"
                  className={styles.input}
                  required
                />
              </div>
              <div className={styles.formGroup}>
                <label htmlFor="duration" className={styles.label}>
                  Duration (days)
                </label>
                <input
                  type="number"
                  id="duration"
                  name="duration"
                  min="1"
                  max="30"
                  placeholder="e.g., 5"
                  className={styles.input}
                  required
                />
              </div>
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="budget" className={styles.label}>
                Budget (USD)
              </label>
              <input
                type="number"
                id="budget"
                name="budget"
                placeholder="e.g., 1000"
                className={styles.input}
                required
              />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>Preferred Activities</label>
              <div className={styles.checkboxGrid}>
                {[
                  "Sightseeing",
                  "Museums",
                  "Food & Dining",
                  "Shopping",
                  "Nature",
                  "Adventure",
                  "Relaxation",
                  "Cultural",
                ].map((activity) => (
                  <label key={activity} className={styles.checkboxLabel}>
                    <input
                      type="checkbox"
                      name="activities"
                      value={activity}
                      className={styles.checkbox}
                    />
                    <span>{activity}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="preferences" className={styles.label}>
                Additional Preferences
              </label>
              <textarea
                id="preferences"
                name="preferences"
                rows={3}
                placeholder="Any dietary restrictions, accessibility requirements, or specific interests?"
                className={styles.textarea}
              />
            </div>

            <button type="submit" className={styles.button} disabled={loading}>
              {loading ? "Generating..." : "Generate Itinerary"}
            </button>
          </form>
        </div>

        {responseDisplay}
      </main>

      <footer className={styles.footer}>
        <p>© 2024 Travel Itinerary Generator. All rights reserved.</p>
      </footer>
    </div>
  );
}
