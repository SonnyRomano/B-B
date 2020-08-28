import React, { Component } from "react";

export default class Footer extends Component {

    render() {
        return (
            <footer>
                <div className="text-center">
                    <h4 style={{ color: '#f2f2f2' }}>Team MARS</h4>
                    {/* <span style={{ fontSize: '3em', color: 'Tomato' }}>
                            <i class="fas fa-rocket"></i>
                        </span> */}
                    <p style={{ color: '#f2f2f2' }}>&copy; 2020</p>
                </div>
            </footer >
        );
    }
}
