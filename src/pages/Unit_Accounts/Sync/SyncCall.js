import React from 'react';
import ShowSyncStatus from './ShowSyncStatus';

export default function SyncCall() {
  return (
    <div style={{ overflowY: "scroll", height: "85vh", padding: "10px" }}>
      <ShowSyncStatus/>
    </div>
  );
}
