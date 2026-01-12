import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";

const SystemDocumentation = () => {
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-white text-black p-8 print:p-4">
      {/* Print Button - Hidden when printing */}
      <div className="print:hidden mb-6 flex justify-end">
        <Button onClick={handlePrint} className="gap-2">
          <Download className="h-4 w-4" />
          Save as PDF
        </Button>
      </div>

      {/* Document Header */}
      <header className="text-center mb-12 border-b-2 border-gray-300 pb-8">
        <h1 className="text-4xl font-bold mb-2">AdWiseManager</h1>
        <h2 className="text-xl text-gray-600 mb-4">System Architecture & Data Flow Documentation</h2>
        <p className="text-sm text-gray-500">Generated: {new Date().toLocaleDateString('en-IN', { 
          year: 'numeric', 
          month: 'long', 
          day: 'numeric' 
        })}</p>
      </header>

      {/* Table of Contents */}
      <section className="mb-10 page-break-after">
        <h2 className="text-2xl font-bold mb-4 text-gray-800">Table of Contents</h2>
        <ol className="list-decimal list-inside space-y-2 text-gray-700">
          <li>Project Overview</li>
          <li>Technology Stack</li>
          <li>System Architecture</li>
          <li>Database Schema</li>
          <li>User Roles & Access Control</li>
          <li>Edge Functions & APIs</li>
          <li>External Integrations</li>
          <li>Data Flow Diagrams</li>
        </ol>
      </section>

      {/* 1. Project Overview */}
      <section className="mb-10">
        <h2 className="text-2xl font-bold mb-4 text-gray-800 border-b pb-2">1. Project Overview</h2>
        <p className="text-gray-700 mb-4">
          <strong>AdWiseManager</strong> is a Billboard Advertising Marketplace platform connecting 
          billboard owners with advertisers. The platform enables owners to list their billboards 
          with automated traffic analysis, while advertisers can discover, compare, and book 
          billboard spaces using AI-powered recommendations.
        </p>
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="font-semibold mb-2">Key Features:</h3>
          <ul className="list-disc list-inside space-y-1 text-gray-600">
            <li>Billboard listing with map-based location selection</li>
            <li>Automated traffic scoring via TomTom API</li>
            <li>AI-powered billboard recommendations</li>
            <li>Campaign management for advertisers</li>
            <li>Razorpay payment integration</li>
            <li>Role-based analytics dashboard</li>
          </ul>
        </div>
      </section>

      {/* 2. Technology Stack */}
      <section className="mb-10">
        <h2 className="text-2xl font-bold mb-4 text-gray-800 border-b pb-2">2. Technology Stack</h2>
        <div className="grid grid-cols-2 gap-6">
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-semibold mb-2 text-blue-700">Frontend</h3>
            <ul className="list-disc list-inside text-gray-600 space-y-1">
              <li>React 18 with TypeScript</li>
              <li>Vite (Build Tool)</li>
              <li>Tailwind CSS</li>
              <li>shadcn/ui Components</li>
              <li>React Router DOM</li>
              <li>TanStack React Query</li>
              <li>Leaflet Maps</li>
            </ul>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-semibold mb-2 text-green-700">Backend</h3>
            <ul className="list-disc list-inside text-gray-600 space-y-1">
              <li>Supabase (BaaS)</li>
              <li>PostgreSQL Database</li>
              <li>Supabase Auth</li>
              <li>Supabase Storage</li>
              <li>Deno Edge Functions</li>
              <li>Row Level Security (RLS)</li>
            </ul>
          </div>
        </div>
      </section>

      {/* 3. System Architecture */}
      <section className="mb-10 page-break-before">
        <h2 className="text-2xl font-bold mb-4 text-gray-800 border-b pb-2">3. System Architecture</h2>
        <div className="bg-gray-50 p-6 rounded-lg">
          <pre className="text-sm text-gray-700 whitespace-pre-wrap font-mono">
{`┌─────────────────────────────────────────────────────────────────┐
│                         FRONTEND                                 │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐              │
│  │   React     │  │  Tailwind   │  │   shadcn    │              │
│  │   + Vite    │  │    CSS      │  │     /ui     │              │
│  └─────────────┘  └─────────────┘  └─────────────┘              │
│                           │                                      │
│  ┌─────────────────────────────────────────────────────────────┐│
│  │                    Page Routes                               ││
│  │  /  /auth  /dashboard  /listings  /map  /campaigns          ││
│  │  /my-bookings  /advertiser  /my-billboards  /owner-bookings ││
│  └─────────────────────────────────────────────────────────────┘│
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                      SUPABASE BACKEND                            │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐              │
│  │    Auth     │  │   Database  │  │   Storage   │              │
│  │   Service   │  │  PostgreSQL │  │   Buckets   │              │
│  └─────────────┘  └─────────────┘  └─────────────┘              │
│                                                                  │
│  ┌─────────────────────────────────────────────────────────────┐│
│  │                    Edge Functions                            ││
│  │  • ai-billboard-recommendations                              ││
│  │  • get-traffic-data                                          ││
│  │  • create-razorpay-order                                     ││
│  │  • verify-razorpay-payment                                   ││
│  └─────────────────────────────────────────────────────────────┘│
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                      EXTERNAL APIs                               │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐              │
│  │   TomTom    │  │  Razorpay   │  │ Lovable AI  │              │
│  │ Traffic API │  │  Payments   │  │   Gateway   │              │
│  └─────────────┘  └─────────────┘  └─────────────┘              │
│                                                                  │
│  ┌─────────────┐                                                │
│  │ OpenStreet  │                                                │
│  │ Map (OSM)   │                                                │
│  └─────────────┘                                                │
└─────────────────────────────────────────────────────────────────┘`}
          </pre>
        </div>
      </section>

      {/* 4. Database Schema */}
      <section className="mb-10 page-break-before">
        <h2 className="text-2xl font-bold mb-4 text-gray-800 border-b pb-2">4. Database Schema</h2>
        
        <div className="space-y-6">
          {/* Profiles Table */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-semibold mb-2 text-purple-700">profiles</h3>
            <p className="text-sm text-gray-600 mb-2">User profile information created on signup</p>
            <table className="w-full text-sm">
              <thead className="bg-gray-200">
                <tr>
                  <th className="text-left p-2">Column</th>
                  <th className="text-left p-2">Type</th>
                  <th className="text-left p-2">Description</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b"><td className="p-2">id</td><td className="p-2">UUID</td><td className="p-2">Primary key</td></tr>
                <tr className="border-b"><td className="p-2">user_id</td><td className="p-2">UUID</td><td className="p-2">Auth user reference</td></tr>
                <tr className="border-b"><td className="p-2">email</td><td className="p-2">TEXT</td><td className="p-2">User email</td></tr>
                <tr className="border-b"><td className="p-2">full_name</td><td className="p-2">TEXT</td><td className="p-2">Display name</td></tr>
                <tr className="border-b"><td className="p-2">role</td><td className="p-2">ENUM</td><td className="p-2">customer | owner</td></tr>
                <tr className="border-b"><td className="p-2">company_name</td><td className="p-2">TEXT</td><td className="p-2">Optional company</td></tr>
                <tr><td className="p-2">phone</td><td className="p-2">TEXT</td><td className="p-2">Contact number</td></tr>
              </tbody>
            </table>
          </div>

          {/* Billboards Table */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-semibold mb-2 text-blue-700">billboards</h3>
            <p className="text-sm text-gray-600 mb-2">Billboard listings created by owners</p>
            <table className="w-full text-sm">
              <thead className="bg-gray-200">
                <tr>
                  <th className="text-left p-2">Column</th>
                  <th className="text-left p-2">Type</th>
                  <th className="text-left p-2">Description</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b"><td className="p-2">id</td><td className="p-2">UUID</td><td className="p-2">Primary key</td></tr>
                <tr className="border-b"><td className="p-2">owner_id</td><td className="p-2">UUID</td><td className="p-2">FK → profiles.user_id</td></tr>
                <tr className="border-b"><td className="p-2">title</td><td className="p-2">TEXT</td><td className="p-2">Billboard name</td></tr>
                <tr className="border-b"><td className="p-2">location</td><td className="p-2">TEXT</td><td className="p-2">Address (auto-geocoded)</td></tr>
                <tr className="border-b"><td className="p-2">latitude, longitude</td><td className="p-2">NUMERIC</td><td className="p-2">Map coordinates</td></tr>
                <tr className="border-b"><td className="p-2">width, height</td><td className="p-2">NUMERIC</td><td className="p-2">Dimensions in meters</td></tr>
                <tr className="border-b"><td className="p-2">price_per_month</td><td className="p-2">NUMERIC</td><td className="p-2">Price in ₹</td></tr>
                <tr className="border-b"><td className="p-2">traffic_score</td><td className="p-2">ENUM</td><td className="p-2">low | medium | high (auto)</td></tr>
                <tr className="border-b"><td className="p-2">daily_impressions</td><td className="p-2">INTEGER</td><td className="p-2">Estimated views (auto)</td></tr>
                <tr><td className="p-2">is_available</td><td className="p-2">BOOLEAN</td><td className="p-2">Booking availability</td></tr>
              </tbody>
            </table>
          </div>

          {/* Bookings Table */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-semibold mb-2 text-green-700">bookings</h3>
            <p className="text-sm text-gray-600 mb-2">Billboard reservations by customers</p>
            <table className="w-full text-sm">
              <thead className="bg-gray-200">
                <tr>
                  <th className="text-left p-2">Column</th>
                  <th className="text-left p-2">Type</th>
                  <th className="text-left p-2">Description</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b"><td className="p-2">id</td><td className="p-2">UUID</td><td className="p-2">Primary key</td></tr>
                <tr className="border-b"><td className="p-2">customer_id</td><td className="p-2">UUID</td><td className="p-2">FK → profiles.user_id</td></tr>
                <tr className="border-b"><td className="p-2">billboard_id</td><td className="p-2">UUID</td><td className="p-2">FK → billboards.id</td></tr>
                <tr className="border-b"><td className="p-2">campaign_id</td><td className="p-2">UUID</td><td className="p-2">FK → campaigns.id</td></tr>
                <tr className="border-b"><td className="p-2">start_date, end_date</td><td className="p-2">DATE</td><td className="p-2">Booking period</td></tr>
                <tr className="border-b"><td className="p-2">total_cost</td><td className="p-2">NUMERIC</td><td className="p-2">Total amount in ₹</td></tr>
                <tr className="border-b"><td className="p-2">status</td><td className="p-2">ENUM</td><td className="p-2">pending | confirmed | active | completed | cancelled</td></tr>
                <tr className="border-b"><td className="p-2">payment_status</td><td className="p-2">TEXT</td><td className="p-2">pending | completed</td></tr>
                <tr><td className="p-2">razorpay_payment_id</td><td className="p-2">TEXT</td><td className="p-2">Payment reference</td></tr>
              </tbody>
            </table>
          </div>

          {/* Campaigns Table */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-semibold mb-2 text-orange-700">campaigns</h3>
            <p className="text-sm text-gray-600 mb-2">Advertising campaigns grouping multiple bookings</p>
            <table className="w-full text-sm">
              <thead className="bg-gray-200">
                <tr>
                  <th className="text-left p-2">Column</th>
                  <th className="text-left p-2">Type</th>
                  <th className="text-left p-2">Description</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b"><td className="p-2">id</td><td className="p-2">UUID</td><td className="p-2">Primary key</td></tr>
                <tr className="border-b"><td className="p-2">customer_id</td><td className="p-2">UUID</td><td className="p-2">FK → profiles.user_id</td></tr>
                <tr className="border-b"><td className="p-2">name</td><td className="p-2">TEXT</td><td className="p-2">Campaign name</td></tr>
                <tr className="border-b"><td className="p-2">description</td><td className="p-2">TEXT</td><td className="p-2">Campaign details</td></tr>
                <tr className="border-b"><td className="p-2">budget</td><td className="p-2">NUMERIC</td><td className="p-2">Total budget in ₹</td></tr>
                <tr><td className="p-2">status</td><td className="p-2">TEXT</td><td className="p-2">draft | active | completed</td></tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* 5. User Roles */}
      <section className="mb-10 page-break-before">
        <h2 className="text-2xl font-bold mb-4 text-gray-800 border-b pb-2">5. User Roles & Access Control</h2>
        
        <div className="grid grid-cols-2 gap-6">
          <div className="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-500">
            <h3 className="font-semibold mb-2 text-blue-700">Customer (Advertiser)</h3>
            <p className="text-sm text-gray-600 mb-3">Books billboards for advertising campaigns</p>
            <h4 className="font-medium text-sm mb-1">Accessible Pages:</h4>
            <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
              <li>Dashboard (booking stats)</li>
              <li>Listings (browse billboards)</li>
              <li>Map View</li>
              <li>AI Recommendations</li>
              <li>Campaigns</li>
              <li>My Bookings</li>
              <li>Analytics</li>
            </ul>
          </div>
          
          <div className="bg-green-50 p-4 rounded-lg border-l-4 border-green-500">
            <h3 className="font-semibold mb-2 text-green-700">Owner</h3>
            <p className="text-sm text-gray-600 mb-3">Lists and manages billboard inventory</p>
            <h4 className="font-medium text-sm mb-1">Accessible Pages:</h4>
            <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
              <li>Dashboard (revenue stats)</li>
              <li>My Billboards (CRUD)</li>
              <li>Booking Requests</li>
              <li>Analytics</li>
            </ul>
          </div>
        </div>

        <div className="mt-6 bg-gray-50 p-4 rounded-lg">
          <h3 className="font-semibold mb-2">Row Level Security (RLS) Policies</h3>
          <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
            <li><strong>billboards:</strong> Anyone can view; only owner can insert/update/delete their own</li>
            <li><strong>bookings:</strong> Customers see own bookings; owners see bookings for their billboards</li>
            <li><strong>campaigns:</strong> Users can only CRUD their own campaigns</li>
            <li><strong>profiles:</strong> All profiles viewable; users can only update their own</li>
          </ul>
        </div>
      </section>

      {/* 6. Edge Functions */}
      <section className="mb-10 page-break-before">
        <h2 className="text-2xl font-bold mb-4 text-gray-800 border-b pb-2">6. Edge Functions & APIs</h2>
        
        <div className="space-y-4">
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-semibold text-purple-700">ai-billboard-recommendations</h3>
            <p className="text-sm text-gray-600 mb-2">AI-powered billboard matching using Lovable AI (Gemini 2.5 Flash)</p>
            <div className="text-sm">
              <p><strong>Input:</strong> budget, preferred_traffic, location_preference</p>
              <p><strong>Output:</strong> Ranked recommendations with match_score, reason, highlights, trade_offs</p>
            </div>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-semibold text-blue-700">get-traffic-data</h3>
            <p className="text-sm text-gray-600 mb-2">Fetches real-time traffic data from TomTom API</p>
            <div className="text-sm">
              <p><strong>Input:</strong> latitude, longitude</p>
              <p><strong>Output:</strong> trafficScore (low/medium/high), dailyImpressions (15k-25k)</p>
            </div>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-semibold text-green-700">create-razorpay-order</h3>
            <p className="text-sm text-gray-600 mb-2">Creates payment order for booking</p>
            <div className="text-sm">
              <p><strong>Input:</strong> amount, booking_id</p>
              <p><strong>Output:</strong> razorpay_order_id, key_id</p>
            </div>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-semibold text-orange-700">verify-razorpay-payment</h3>
            <p className="text-sm text-gray-600 mb-2">Verifies payment signature and updates booking status</p>
            <div className="text-sm">
              <p><strong>Input:</strong> razorpay_order_id, razorpay_payment_id, razorpay_signature</p>
              <p><strong>Output:</strong> success status, updates booking to confirmed</p>
            </div>
          </div>
        </div>
      </section>

      {/* 7. External Integrations */}
      <section className="mb-10">
        <h2 className="text-2xl font-bold mb-4 text-gray-800 border-b pb-2">7. External Integrations</h2>
        
        <table className="w-full text-sm">
          <thead className="bg-gray-200">
            <tr>
              <th className="text-left p-3">Service</th>
              <th className="text-left p-3">Purpose</th>
              <th className="text-left p-3">Secret Keys</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b">
              <td className="p-3 font-medium">TomTom Traffic API</td>
              <td className="p-3">Real-time traffic density for scoring</td>
              <td className="p-3"><code>TOMTOM_API_KEY</code></td>
            </tr>
            <tr className="border-b">
              <td className="p-3 font-medium">Razorpay</td>
              <td className="p-3">Payment processing (INR)</td>
              <td className="p-3"><code>RAZORPAY_KEY_ID</code>, <code>RAZORPAY_KEY_SECRET</code></td>
            </tr>
            <tr className="border-b">
              <td className="p-3 font-medium">Lovable AI Gateway</td>
              <td className="p-3">AI recommendations (Gemini 2.5 Flash)</td>
              <td className="p-3"><code>LOVABLE_API_KEY</code></td>
            </tr>
            <tr>
              <td className="p-3 font-medium">OpenStreetMap Nominatim</td>
              <td className="p-3">Reverse geocoding for addresses</td>
              <td className="p-3">None (public API)</td>
            </tr>
          </tbody>
        </table>
      </section>

      {/* 8. Data Flow */}
      <section className="mb-10 page-break-before">
        <h2 className="text-2xl font-bold mb-4 text-gray-800 border-b pb-2">8. Data Flow Diagrams</h2>
        
        <div className="space-y-6">
          <div className="bg-blue-50 p-4 rounded-lg">
            <h3 className="font-semibold mb-2">Billboard Creation Flow</h3>
            <pre className="text-sm font-mono">
{`Owner → Select Location on Map
      → Nominatim API (reverse geocode → address)
      → TomTom API (traffic data → score + impressions)
      → Save to billboards table`}
            </pre>
          </div>

          <div className="bg-green-50 p-4 rounded-lg">
            <h3 className="font-semibold mb-2">AI Recommendation Flow</h3>
            <pre className="text-sm font-mono">
{`Customer → Input (budget, traffic, location)
         → Edge Function → Fetch available billboards
         → Lovable AI (Gemini) → Analyze & rank
         → Return recommendations with scores`}
            </pre>
          </div>

          <div className="bg-orange-50 p-4 rounded-lg">
            <h3 className="font-semibold mb-2">Booking & Payment Flow</h3>
            <pre className="text-sm font-mono">
{`Customer → Select billboard → Create booking (pending)
         → create-razorpay-order → Razorpay checkout
         → verify-razorpay-payment → Update booking (confirmed)
         → Owner notified of new booking`}
            </pre>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="text-center text-sm text-gray-500 pt-8 border-t mt-12">
        <p>AdWiseManager - Billboard Advertising Marketplace</p>
        <p>Documentation v1.0 | Built with Lovable</p>
      </footer>

      {/* Print Styles */}
      <style>{`
        @media print {
          .page-break-before { page-break-before: always; }
          .page-break-after { page-break-after: always; }
          body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
        }
      `}</style>
    </div>
  );
};

export default SystemDocumentation;
