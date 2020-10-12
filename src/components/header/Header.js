import React from 'react';
import './Header.css';

const Header = () => {
    return (
        <div className='header'>
            <h1 className='header__title'>Finding Falcone!</h1>
            <h6 className='header__tag'>
                <a 
                    className='header__link' 
                    target='_blank' 
                    rel="noopener noreferrer" 
                    href='https://www.geektrust.in'>
                    GeekTrust Home
                </a>
            </h6>
        </div>
    )
}

export default Header;
