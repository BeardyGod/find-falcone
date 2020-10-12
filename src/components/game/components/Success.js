import React, { useState, useEffect, Fragment } from 'react';
import './Success.css';
import { Link } from 'react-router-dom';
import Spinner from './spinner';

const Success = ({ location, history}) => {
    
    let planetNames = [];
    let vehicleNames = [];
    
    const [isConnected, setIsConnected] = useState(true);
    const [loading, setLoading] = useState(true);
    const [successMessage, setSuccessMessage] = useState("");
    const [planet, setPlanet] = useState("");
    const [totalTime, setTotalTime] = useState("");
    
    
    useEffect(() => {
        let destinations = location.state;
        if(destinations !== undefined) {
            // eslint-disable-next-line
            planetNames = destinations.map(a => {
                return a.destination;
            })
            // eslint-disable-next-line
            vehicleNames = destinations.map(a => {
                return a.vehicle;
            })
        }
        setTotalTime(location.totalTime);
        
        getTokenAPI();
    }, [])

    const getTokenAPI = () => {
        fetch("https://findfalcone.herokuapp.com/token", {
            method: 'POST',
            headers: {
                'Accept': 'application/json'
            },
            body: {}
        }).then(res => res.json())
        .then((data) => {
           findFalconeAPI(data.token, planetNames, vehicleNames);
        }).catch( e => {
            setIsConnected(false);
            setTimeout(getTokenAPI, 5000);
        });
    }

    const findFalconeAPI = (token, planetNames, vehicleNames) => {
        setSuccessMessage("Please wait while we calculate..");
        
        fetch("https://findfalcone.herokuapp.com/find", {
            method: 'POST',
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                "token": token,
                "planet_names": planetNames,
                "vehicle_names": vehicleNames
            })
        }).then(res => res.json())
        .then((data) => {
            setLoading(false);
            setIsConnected(true);

            if(data.status === "error" || data === undefined || location.fromGame !== true) {
                setSuccessMessage("Please re-initialize the game!");
                history.push('/');
            } else if(data.status === 'false') {
                setSuccessMessage("Sorry! You could not find Falcone!");
            } else {
                setSuccessMessage("Congrats! You found Falcone! King Shan is pleased!");
                setPlanet(data.planet_name);
            }                
        }).catch( e => {
            setTimeout(findFalconeAPI, 5000);
        });
    }

    return ( 
        <Fragment>
            <div className="success">
                <div className="success__loading">
                    {loading && <Spinner />} 
                    {!loading && !isConnected ? <span>Please wait while we try to connect...</span> : null}
                    <h1 className="success__msg">{successMessage}</h1> 
                </div>
                <div className="success__pt">
                    {
                        (planet !== null || planet !== undefined) && (planet.length > 0) 
                        ? <h2 className="success__found">Planet - <code className="success__badge">{planet}</code></h2>
                        : null
                    }
                </div>
                <div className="success__pt">
                    {
                        (planet !== null || planet !== undefined) && (planet.length > 0) 
                        ? <h2 className="success__found">Time taken - <code className="success__badge success--time">{totalTime}</code></h2>
                        : null
                    }
                </div>
                <div className="success__play">
                    <Link to={{pathname:"/", fromGame: true}}>
                        <button className="success__btn">Play Again!</button>
                    </Link>
                </div>
            </div>
        </Fragment>
        
        );
    }

 
export default Success;