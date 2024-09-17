import React from "react";

const VerifyEmail = ({ href }: { href: string }) => {
    return (
        <div>
            to verify you account, please click <a href={href}>here</a>
        </div>
    );
};

export default VerifyEmail;
