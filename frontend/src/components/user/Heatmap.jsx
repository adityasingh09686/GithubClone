import { useState, useEffect } from 'react';
import CalendarHeatmap from 'react-calendar-heatmap';
import 'react-calendar-heatmap/dist/styles.css';
import { Tooltip } from 'react-tooltip';
import './profile.css';

const Heatmap = () => {
  const [heatmapData, setHeatmapData] = useState([]);
  const [totalContributions, setTotalContributions] = useState(0);
  
  const today = new Date();
  const startDate = new Date(today);
  startDate.setDate(startDate.getDate() - 120);

  useEffect(() => {
    const fetchRepoData = async () => {
      try {
        const userId = localStorage.getItem("userId");
        if (!userId) return;

        // Fetch user's repos
        const response = await fetch(`http://localhost:5000/repo/user/${userId}`);
        if (!response.ok) throw new Error('Failed to fetch repos');
        
        const data = await response.json();
        const repos = data.repositories || [];
        
        // Group by created date
        const dateCounts = {};
        
        repos.forEach(repo => {
          // Fallback to today if repo lacks createdAt (for old records before we added timestamps)
          const date = repo.createdAt ? new Date(repo.createdAt) : new Date();
          const dateString = date.toISOString().split('T')[0];
          
          if (dateCounts[dateString]) {
            dateCounts[dateString] += 1;
          } else {
            dateCounts[dateString] = 1;
          }
        });

        // Format for react-calendar-heatmap
        const formattedData = Object.keys(dateCounts).map(date => {
          let count = dateCounts[date];
          // Cap the visual intensity to level 4
          let level = count > 4 ? 4 : count;
          return { date, count: level, actualCount: count };
        });

        setHeatmapData(formattedData);
        setTotalContributions(repos.length);
      } catch (err) {
        console.error("Error fetching heatmap data:", err);
      }
    };

    fetchRepoData();
  }, []);

  return (
    <div className="heatmap-container">
      <div className="heatmap-header">
        <h3>Recent Contributions</h3>
        <span className="contribution-count">{totalContributions} repositories created</span>
      </div>
      
      <div className="heatmap-graph react-heatmap-wrapper">
        <CalendarHeatmap
          startDate={startDate}
          endDate={today}
          values={heatmapData}
          classForValue={(value) => {
            if (!value || value.count === 0) {
              return 'color-empty';
            }
            return `color-scale-${value.count}`;
          }}
          tooltipDataAttrs={(value) => {
            if (!value || !value.date) return { 'data-tooltip-id': 'heatmap-tooltip', 'data-tooltip-content': 'No contributions' };
            const countLabel = value.actualCount === 1 ? '1 repository' : `${value.actualCount} repositories`;
            return {
              'data-tooltip-id': 'heatmap-tooltip',
              'data-tooltip-content': `${countLabel} created on ${value.date}`
            };
          }}
          showWeekdayLabels={true}
        />
        <Tooltip id="heatmap-tooltip" />
      </div>
      
      <div className="heatmap-legend">
        <span>Less</span>
        <div className="heatmap-cell color-empty"></div>
        <div className="heatmap-cell color-scale-1"></div>
        <div className="heatmap-cell color-scale-2"></div>
        <div className="heatmap-cell color-scale-3"></div>
        <div className="heatmap-cell color-scale-4"></div>
        <span>More</span>
      </div>
    </div>
  );
};

export default Heatmap;
