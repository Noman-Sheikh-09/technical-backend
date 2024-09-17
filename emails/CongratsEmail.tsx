import React from "react";

const CongratsEmail = ({ name }: { name: string }) => {
    return (
        <div>
            <h3>Congrats {name}!</h3>
            <p>Congratulations to join us!</p>
        </div>
    );
};

export default CongratsEmail;
