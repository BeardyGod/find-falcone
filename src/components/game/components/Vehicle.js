import React, { Fragment } from 'react';
import './Vehicle.css'

const Vehicle = ({ destinationProps, vehicleCount, onChange }) => {
    
 
        
        return ( 
                <div className="ship">
                    {destinationProps.eligibleVehicles.map(vehicle => 
                    
                    <Fragment key={vehicle.name}>
                        <input  
                            disabled={vehicleCount.filter( a => { return a.name === vehicle.name})[0].total_no === 0 ? true : false} 
                            onChange={onChange} 
                            checked={destinationProps.vehicle.length===0?false:null} 
                            type="radio" 
                            name={destinationProps.name} 
                            value={vehicle.name} 
                        />
                        <label className="ship__label">
                            {vehicle.name} ({vehicleCount.filter(a=>{return a.name === vehicle.name})[0].total_no})
                        </label>
                        
                    </Fragment>)}
                </div>
         );
}

 
export default Vehicle;