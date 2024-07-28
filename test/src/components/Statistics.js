// Statistics.js
import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Bar } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import './Statistics.css'; 

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);

const Statistics = () => {
    const location = useLocation();
    const { scores, username } = location.state || { scores: {}, username: '' };

    useEffect(() => {
        console.log("Received state:", location.state);
    }, [location.state]);

    const gameData = {
        labels: ['Tic Tac Toe', 'Bricks Mania', '2048 Game', 'Sliding Puzzle'],
        datasets: [
            {
                label: 'Scores',
                data: [
                    scores['tic-tac-toe'] || 0,
                    scores['bricks-mania'] || 0,
                    scores['2048-game'] || 0,
                    scores['slidding-puzzle'] || 0,
                ],
                backgroundColor: [
                    'rgba(255, 99, 132, 0.7)',
                    'rgba(54, 162, 235, 0.7)',
                    'rgba(255, 206, 86, 0.7)',
                    'rgba(75, 192, 192, 0.7)',
                ],
                borderColor: [
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(75, 192, 192, 1)',
                ],
                borderWidth: 1,
            },
        ],
    };

    let answered, wrong;

    if (username === 'chand_1') {
        answered = 18;
        wrong = 2;
    } else if (username === 'sree_akhil') {
        answered = 17;
        wrong = 3;
    } else {
        answered = 15;
        wrong = 5;
    }

    const quizData = {
        labels: ['Questions Attempted', 'Correct Answers', 'Wrong Answers'],
        datasets: [
            {
                label: 'Quiz Data',
                data: [20, answered, wrong],
                backgroundColor: [
                    'rgba(75, 192, 192, 0.7)', // Color for Questions Attempted
                    'rgba(153, 102, 255, 0.7)', // Color for Correct Answers
                    'rgba(255, 99, 132, 0.7)', // Color for Wrong Answers
                ],
                borderColor: [
                    'rgba(75, 192, 192, 1)',
                    'rgba(153, 102, 255, 1)',
                    'rgba(255, 99, 132, 1)',
                ],
                borderWidth: 1,
            },
        ],
    };

    const options = {
        plugins: {
          legend: {
            labels: {
              color: 'black', // Legend label text color
              font: {
                size: 14, // Font size
              },
            },
          },
        },
        scales: {
          x: {
            ticks: {
              color: 'black', // X axis label color
              font: {
                size: 14, // Font size
              },
            },
          },
          y: {
            ticks: {
              color: 'black', // Y axis label color
              font: {
                size: 14, // Font size
              },
            },
          },
        },
      };

    return (
        <div className="statistics-container">
            <h2>Game Statistics</h2>
            <div className="chart-container">
                <Bar data={gameData} options={options}/>
            </div>
            <h2>Quiz Data</h2>
            <div className="chart-container">
                <Bar data={quizData} options={options}/>
            </div>
            <div className="username-container">
                <h3>Username: {username || 'No username provided'}</h3>
            </div>
        </div>
    );
};

export default Statistics;
