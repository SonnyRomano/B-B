import React, { Component } from "react";

export default class Footer extends Component {

    render() {
        return (
            // <div style={{ marginBottom: '0', marginTop: '12rem', textAlign: 'center' }}>
            //     <p className="font-italic"
            //         style={{ fontSize: '2.5rem', textShadow: '-2px 0 #000, 0 2px #000, 2px 0 #000, 0 -2px #000', color: 'aliceblue' }}>
            //         &copy; Team Mars</p>
            // </div >
            <footer>
                <div className="container" style={{}}>
                    <div className="col text-center py-4">
                        <h3 style={{ color: '#f2f2f2' }}>Team MARS</h3>
                        <p style={{ color: '#f2f2f2' }}>&copy; 2020</p>
                    </div>
                </div>
            </footer >
        );
    }
}
