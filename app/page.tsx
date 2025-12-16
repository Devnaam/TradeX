export default function Home() {
  return (
    <div className="min-h-screen p-8">
      <div className="max-w-md mx-auto space-y-6">
        <h1 className="text-page-title text-center">TradeX Design System</h1>
        
        {/* Card Test */}
        <div className="card">
          <h2 className="text-section-title mb-2">My Wallet</h2>
          <p className="text-amount">₹5,000</p>
          <p className="text-income">₹1,250</p>
        </div>

        {/* Buttons Test */}
        <div className="space-y-3">
          <button className="btn-primary">Primary Button</button>
          <button className="btn-secondary">Secondary Button</button>
          <button className="btn-success">Success Button</button>
        </div>

        {/* Input Test */}
        <input 
          type="text" 
          placeholder="Enter amount" 
          className="input-field"
        />

        {/* Status Test */}
        <div className="card space-y-2">
          <p className="status-pending">Pending</p>
          <p className="status-approved">Approved</p>
          <p className="status-active">Active</p>
        </div>
      </div>
    </div>
  );
}
