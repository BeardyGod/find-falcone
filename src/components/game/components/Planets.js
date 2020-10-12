import React from 'react';
import './Planets.css';

const Planets = ({ id, onChange, name, destinationProps, planets }) => {

        return ( 
                    <div className='planet'>
                        <h3 className='planet__tag'>Destination {id}</h3>
                        <select 
                            onChange={onChange} 
                            className="planet__destination" 
                            name={name} 
                            value={destinationProps.destination}
                        >
                            <option>{destinationProps.destination}</option>
                            {planets.map(planet => <option key={planet.name} >{planet.name}</option>)}
                        </select>
                           
                    </div>  
         );
}

 
export default Planets;