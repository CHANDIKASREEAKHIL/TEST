import React, { useState, useEffect } from "react";
import { db } from "./firebase";
import { collection, getDocs } from "firebase/firestore";
import { useNavigate } from 'react-router-dom';
import LoginHeader from "./header/LoginHeader";

function Progress() {
    const [gameReports, setGameReports] = useState([]);
    const [usersData, setUsersData] = useState({});
    const navigate = useNavigate();

    useEffect(() => {
        const fetchGameReports = async () => {
            try {
                const gameReportsSnapshot = await getDocs(collection(db, "GameReports"));
                let reports = [];

                gameReportsSnapshot.forEach((doc) => {
                    reports.push({ id: doc.id, ...doc.data() });
                });

                setGameReports(reports);
            } catch (error) {
                console.error("Error fetching game reports:", error);
            }
        };

        fetchGameReports();
    }, []);

    useEffect(() => {
        const fetchUsersData = async () => {
            try {
                const usersDataSnapshot = await getDocs(collection(db, "Users"));
                let userDataMap = {};

                usersDataSnapshot.forEach((doc) => {
                    userDataMap[doc.id] = doc.data();
                });

                setUsersData(userDataMap);
            } catch (error) {
                console.error("Error fetching users data:", error);
            }
        };

        fetchUsersData();
    }, []);

    const renderTableHeader = () => {
        return (
            <div style={{ display: "flex", marginBottom: "10px" }}>
                <div style={{ flex: 1, textAlign: "center" }}>Username</div>
                <div style={{ flex: 1, textAlign: "center" }}>Email</div>
                <div style={{ flex: 1, textAlign: "center" }}>Tic Tac Toe</div>
                <div style={{ flex: 1, textAlign: "center" }}>Bricks Mania</div>
                <div style={{ flex: 1, textAlign: "center" }}>2048 Game</div>
                <div style={{ flex: 1, textAlign: "center" }}>Sliding Puzzle</div>
                <div style={{ flex: 1, textAlign: "center" }}>Quiz Statistics</div>
            </div>
        );
    };

    const renderTableData = () => {
        return gameReports.map((report) => {
            const { user, scores } = report;
            const userData = usersData[user] || {};
            const { email, username } = userData;

            return (
                <div key={report.id} style={{ display: "flex", marginBottom: "2vh" }}>
                    <div style={{ flex: 1, textAlign: "center" }}>{username}</div>
                    <div style={{ flex: 1, textAlign: "center" }}>{email}</div>
                    <div style={{ flex: 1, textAlign: "center" }}>{scores["tic-tac-toe"] || 0}</div>
                    <div style={{ flex: 1, textAlign: "center" }}>{scores["bricks-mania"] || 0}</div>
                    <div style={{ flex: 1, textAlign: "center" }}>{scores["2048-game"] || 0}</div>
                    <div style={{ flex: 1, textAlign: "center" }}>{scores["slidding-puzzle"] || 0}</div>
                    <div style={{ flex: 1, textAlign: "center" }}>
                    <button
      onClick={() => navigate('/statistics', { state: { scores, username } })}
      style={{
        backgroundColor: '#007bff', // Blue background color
        color: 'white',
        border: 'none',
        padding: '10px 20px',
        textAlign: 'center',
        textDecoration: 'none',
        display: 'inline-block',
        fontSize: '16px',
        cursor: 'pointer',
        borderRadius: '5px',
        transition: 'background-color 0.3s ease',
      }}
      onMouseOver={(e) => e.target.style.backgroundColor = '#0056b3'} // Darker blue on hover
      onMouseOut={(e) => e.target.style.backgroundColor = '#007bff'} // Reset on mouse out
    >
      View Dashboard
    </button>
                    </div>
                </div>
            );
        });
    };

    return (
        <div className="mainDiv">
            <LoginHeader />
            <div className="innerGrid" style={{ gridTemplateColumns: "1fr", fontWeight: "600" }}>
                <div style={{ margin: "0vh 2vw 1vh 2vw", borderRadius: "4px", overflow: "hidden", fontFamily: "Arial, sans-serif", width: "95%", boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)" }}>
                    <div style={{ backgroundColor: "#FFC340", padding: "10px 0" }}>
                        {renderTableHeader()}
                    </div>
                    <div style={{ padding: "10px 0" }}>
                        {renderTableData()}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Progress;
