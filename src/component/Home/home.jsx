import React, { Component } from 'react';
import logoimg from '../../assets/images/logo.svg';
import Layout from '../Layout/layout';

class Home extends Component {

    componentDidMount() {
        //document.body.classList.add("admin-skinbg");

        setTimeout(() => {
            this.props.history.push("/login");
        }, 2000)
    }

    render() {
        return (
            <>
                <div className="admin-skinbg">
                <div className="main-page">
                    <img src={logoimg} alt="Svaas" style={{ width: '135px'}} />
                    <p>Doctor App</p>
                </div>
                </div>
            </>
        );
    }
}

export default Home;