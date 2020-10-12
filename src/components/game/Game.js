import React, { Component } from 'react';
import Planets from './components/Planets';
import Vehicle from './components/Vehicle';
import request from './request';
import { Link } from 'react-router-dom';
import './Game.css';

class Game extends Component {
    
    state = { 
       loading: true,
       planets: [],
       destinations: [
           {id:"One",name:"planetOne",destination:"----",vehicle:"",timeTaken:0,isSelected:false,eligibleVehicles:[]},
           {id:"Two",name:"planetTwo",destination:"----",vehicle:"",timeTaken:0,isSelected:false,eligibleVehicles:[]},
           {id:"Three",name:"planetThree",destination:"----",vehicle:"",timeTaken:0,isSelected:false,eligibleVehicles:[]},
           {id:"Four",name:"planetFour",destination:"----",vehicle:"",timeTaken:0,isSelected:false,eligibleVehicles:[]}
       ],
       vehicles: [],
       disabled: true,
       totalTime: 0,
    }

    originalVehicles = [];
    originalPlanetList = [];

    callPlanetsAPI = () => {
        fetch(request.fetchPlanets)
            .then(res => res.json())
            .then((planets) => {
                this.setState({planets});
                this.originalPlanetList.push(planets);
            }).catch(e => {
                setTimeout(this.callPlanetsAPI, 5000);
            });
        
    }


    callVehiclesAPI = () => {
        fetch(request.fetchVehicles)
            .then(res => res.json())
            .then((vehicles) => {
                this.setState({vehicles});
                this.originalVehicles.push(vehicles);
                this.setState({loading:false});
            }).catch(e => {
                setTimeout(this.callVehiclesAPI, 5000);
            });
    }

    
    componentDidMount() {
        this.callPlanetsAPI();
        this.callVehiclesAPI();
    }


    handleChange = (e) => {
        var isSelected = this.state.destinations.filter(destination => {
            return e.target.name === destination.name;
        });
        
        if(isSelected[0].isSelected === false) {
            var remPlanet = this.state.planets.filter(planet => {
                  return planet.name !== e.target.value;
            });             
            this.setState({planets:remPlanet});
          }
         else{
            var _prevPlanet = isSelected[0];
             
            var prevPlanet = this.originalPlanetList[0].filter(planet => planet.name === _prevPlanet.destination);
            
             let _remPlanets = [...this.state.planets];
             _remPlanets.push(prevPlanet[0]);
             var remPlanets = _remPlanets.filter(planet => {
                  return planet.name !== e.target.value;
             });
             this.setState({planets:remPlanets}); 
         }
         
         var destinations = [...this.state.destinations];
         destinations.map(d => {
             if(d.name === e.target.name) {
                 d.isSelected = true;
                 d.destination = e.target.value;
                 d.vehicle = "";
                 d.timeTaken = 0;
             }
             return '';
         });
         this.setState({destinations});

        let planet = this.state.planets.filter(planet => {
            return planet.name === e.target.value;
        });
        this.handleVehicles(planet, e);
    }

    handleVehicles = (planet, e) => {
        let eligibleVehicles = this.state.vehicles.filter(vehicle => {
            return vehicle.max_distance >= planet[0].distance;
        });
        var destinations = [...this.state.destinations];
         destinations.map(d => {
             if(d.name === e.target.name){
                 d.eligibleVehicles = eligibleVehicles;
             }
             return '';
         });
         this.setState({destinations});
    }

    handleReset = () => {
        this.setState({
            loading: true,
            planets: [],
            destinations: [
                {id:"One",name:"planetOne",destination:"----",vehicle:"",timeTaken:0,isSelected:false},
                {id:"Two",name:"planetTwo",destination:"----",vehicle:"",timeTaken:0,isSelected:false},
                {id:"Three",name:"planetThree",destination:"----",vehicle:"",timeTaken:0,isSelected:false},
                {id:"Four",name:"planetFour",destination:"----",vehicle:"",timeTaken:0,isSelected:false}
            ],
            vehicles: [],
            disabled: true,
            totalTime: 0
        });
        this.callPlanetsAPI();
        this.callVehiclesAPI();
    }

    handleVehicleChange = (e) => {
        var destinations = [...this.state.destinations];
         destinations.map(d => {
             if(d.name === e.target.name) {
                 if(d.vehicle === "") {
                        this.handleVehicleCountWhenNotSelected(e);
                 } else {
                    this.handleVehicleCountWhenSelected(e);
                 }
                 d.vehicle = e.target.value;
             }
             return '';
         });
         this.setState({destinations});
         this.changeButtonState();
         this.handleTime(e);
         
    }

    handleVehicleCountWhenNotSelected = (e) => {
        var vehicles = [...this.state.vehicles]
        vehicles.map(a => {
            if(e.target.value === a.name)
                a.total_no-= 1;
            return '';
        })
        this.setState({vehicles});
    }

    handleVehicleCountWhenSelected = (e) => {      
        var prevVehicle = this.state.destinations.filter(a => {
            return a.name === e.target.name;
        })[0].vehicle;

        var vehicles = [...this.state.vehicles]
        vehicles.map(a => {
            if(e.target.value === a.name)
                a.total_no-= 1;
            if(a.name === prevVehicle)
                a.total_no+=1;
            return '';
        })
        
        this.setState({vehicles});
    }

    changeButtonState = () => {
       var disabled = this.state.destinations.every(a => {
            return a.vehicle.length > 0;
        })
        this.setState({disabled:!disabled});
    }

    handleTime = (e) => {
        
        var desObj = this.state.destinations.filter(a => {
            return a.name === e.target.name;
        });
        
        var planet=desObj[0].destination;
        var plObj = this.originalPlanetList[0].filter(a => {
            return planet === a.name;
        });
        var distance = plObj[0].distance;
        
        var vehicleObj = this.state.vehicles.filter(a => {
            return a.name === e.target.value
        })
        var speed = vehicleObj[0].speed;
        var time = distance/speed;
        var destinations = [...this.state.destinations];
        destinations.map(a => {
            if(a.name === e.target.name)
                a.timeTaken = time;
                return '';
        })
        this.setState({destinations});
        this.calTotalTime();
    }

    calTotalTime = () => {
        var destinations = [...this.state.destinations];
        let totalTime = 0;
        destinations.map(a => {
            totalTime+= a.timeTaken
            return '';
        })
        this.setState({totalTime});
    }
    
    render() { 
        
        return (
            <div className='body'>
                <h3 className='body__statement'>Select planets you want to search in:</h3>
                <div className="body__card">
                    {
                        this.state.destinations.map( destination => 
                                   
                            <div 
                                key={destination.id} 
                                style={!destination.isSelected ? {height:'min-content'} : null} 
                                className="col myCard"
                            >
                                <Planets 
                                    planets={this.state.planets} 
                                    onChange={this.handleChange} 
                                    destinationProps={destination} 
                                    name={destination.name} 
                                    key={destination.id} 
                                    id={destination.id} 
                                />
                                {destination.isSelected ? <Vehicle 
                                    vehicleCount={this.state.vehicles} 
                                    onChange={this.handleVehicleChange} 
                                    destinationProps={destination} />
                                : null}
                            </div>
                            
                                    )
                    }
    
    
                    {/* <Card planets={planets} vehicles={vehicles} onChange={handleChange} key={planets.name}/>
                    <Card planets={planets} vehicles={vehicles} onChange={handleChange} />
                    <Card planets={planets} vehicles={vehicles} onChange={handleChange} />
                    <Card planets={planets} vehicles={vehicles} onChange={handleChange} /> */}
                </div>
                <div className="body__time">
                    <h3>Time Taken : {this.state.totalTime} </h3>
                </div>
                <div className="body__btn">
                    <Link 
                        disabled 
                        to={{
                            pathname: "/success", 
                            state: this.state.destinations, 
                            fromGame:true,
                            totalTime:this.state.totalTime
                        }}
                    >
                        <button disabled={this.state.disabled} className="body__btn1" type='submit'>Find Falcone</button>
                    </Link>
                    {/* <button disabled={this.state.disabled} className="body__btn1" type='submit'>Find Falcone</button> */}
                    <button disabled={this.state.loading}  onClick={this.handleReset} className="body__btn1 body--btn2" type="reset">Reset</button>
                </div>
                
            </div>
        )
    }
}

export default Game
