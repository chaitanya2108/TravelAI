import { FormEvent, useState } from "react";
import styles from "../app/page.module.css";

interface TripFormProps {
  onSubmit: (e: FormEvent<HTMLFormElement>) => Promise<void>;
  loading: boolean;
}

export const TripForm = ({ onSubmit, loading }: TripFormProps) => {
  const [selectedActivities, setSelectedActivities] = useState<string[]>([]);
  const [activityInput, setActivityInput] = useState("");

  const activities = [
    "Sightseeing",
    "Museums",
    "Food & Dining",
    "Shopping",
    "Nature",
    "Adventure",
    "Relaxation",
    "Cultural",
  ];

  const today = new Date().toISOString().split("T")[0];

  const handleActivitySelect = (activity: string) => {
    if (!selectedActivities.includes(activity)) {
      setSelectedActivities([...selectedActivities, activity]);
    }
    setActivityInput("");
  };

  const removeActivity = (activity: string) => {
    setSelectedActivities(selectedActivities.filter((a) => a !== activity));
  };

  const filteredActivities = activities.filter((activity) =>
    activity.toLowerCase().includes(activityInput.toLowerCase())
  );

  return (
    <div className={styles.searchBarContainer}>
      <form className={styles.searchForm} onSubmit={onSubmit}>
        <div className={styles.searchInputGroup}>
          <div className={styles.inputWrapper}>
            <input
              type="text"
              id="destination"
              name="destination"
              placeholder="Where to?"
              className={styles.searchInput}
              required
            />
          </div>

          <div className={styles.dateInputs}>
            <input
              type="date"
              id="startDate"
              name="startDate"
              className={styles.dateInput}
              min={today}
              required
            />
            <input
              type="date"
              id="endDate"
              name="endDate"
              className={styles.dateInput}
              min={today}
              required
            />
          </div>

          <div className={styles.inputWrapper}>
            <input
              type="number"
              id="budget"
              name="budget"
              placeholder="Budget (USD)"
              className={styles.searchInput}
              required
            />
          </div>

          <div className={styles.activityDropdown}>
            <div className={styles.activityInputWrapper}>
              <input
                type="text"
                value={activityInput}
                onChange={(e) => setActivityInput(e.target.value)}
                placeholder="Activities"
                className={styles.activityInput}
              />
              <span className={styles.dropdownArrow}>▼</span>
            </div>
            {activityInput && (
              <ul className={styles.activityList}>
                {filteredActivities.map((activity) => (
                  <button
                    key={activity}
                    onClick={() => handleActivitySelect(activity)}
                    className={styles.activityItem}
                    type="button"
                  >
                    {activity}
                  </button>
                ))}
              </ul>
            )}
            <div className={styles.selectedActivities}>
              {selectedActivities.map((activity) => (
                <span key={activity} className={styles.activityTag}>
                  {activity}
                  <button
                    type="button"
                    onClick={() => removeActivity(activity)}
                    className={styles.removeActivity}
                  >
                    ×
                  </button>
                  <input type="hidden" name="activities" value={activity} />
                </span>
              ))}
            </div>
          </div>

          <button
            type="submit"
            className={styles.searchButton}
            disabled={loading}
          >
            {loading ? "Searching..." : "Search"}
          </button>
        </div>
      </form>
    </div>
  );
};
