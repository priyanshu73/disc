import React from 'react';
import './AccountInfo.css';

const AccountInformationSection = ({ user }) => {
  if (!user) return null;
  return (
    <div className="sectionContainer">
      <div className="sectionHeader">
        <h2 className="sectionTitle">Account Information</h2>
        <p className="sectionDescription">These are your personal details.</p>
      </div>
      <div className="contentBody">
        {/* Avatar Display */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <img src="/profileIcon.png" alt="User Avatar" style={{ width: '64px', height: '64px', borderRadius: '50%', objectFit: 'cover' }} />
          <div>
            <p style={{ fontWeight: 600, fontSize: '1.1rem', color: '#2d3748' }}>
              {user.firstname} {user.lastname}
            </p>
            <p style={{ color: '#718096' }}>@{user.username}</p>
          </div>
        </div>

        <hr className="separator" />

        {/* Static Info Grid */}
        <div className="infoGrid">
          <InfoItem label="First Name" value={user.firstname} />
          <InfoItem label="Last Name" value={user.lastname} />
          <InfoItem label="Email Addres" value={user.username + "@gettysburg.edu"} />
          <InfoItem label="Instructor" value={user.instructor} />
          <InfoItem label="Class Year" value={user.class_year} />
          <InfoItem label="Graduating Semester" value={user.semester === 'S' ? "Spring" : "Fall"} />
          
        </div>
      </div>
    </div>
  );
};

const InfoItem = ({ label, value }) => (
  <div className="infoItemBox">
    <p className="infoLabel">{label}</p>
    <div className="infoValueBox">{value}</div>
  </div>
);

export default AccountInformationSection; 