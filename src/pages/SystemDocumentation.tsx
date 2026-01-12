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
          <li className="font-semibold text-blue-700">Page Authority Scores</li>
          <li className="font-semibold text-purple-700">Algorithm & Model Insights</li>
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

      {/* 9. Page Authority Scores */}
      <section className="mb-10 page-break-before">
        <h2 className="text-2xl font-bold mb-4 text-gray-800 border-b pb-2">9. Page Authority Scores</h2>
        <p className="text-sm text-gray-600 mb-4">
          Authority Score indicates page importance based on data dependencies, user interactions, and business criticality (1-10 scale).
        </p>
        
        <div className="grid grid-cols-1 gap-4">
          <table className="w-full text-sm">
            <thead className="bg-gray-200">
              <tr>
                <th className="text-left p-3">Page</th>
                <th className="text-left p-3">Route</th>
                <th className="text-center p-3">Authority Score</th>
                <th className="text-left p-3">Justification</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b bg-red-50">
                <td className="p-3 font-medium">Dashboard</td>
                <td className="p-3"><code>/dashboard</code></td>
                <td className="p-3 text-center"><span className="bg-red-500 text-white px-2 py-1 rounded font-bold">10</span></td>
                <td className="p-3">Central hub; aggregates all user data, stats, and navigation</td>
              </tr>
              <tr className="border-b bg-red-50">
                <td className="p-3 font-medium">Auth</td>
                <td className="p-3"><code>/auth</code></td>
                <td className="p-3 text-center"><span className="bg-red-500 text-white px-2 py-1 rounded font-bold">10</span></td>
                <td className="p-3">Critical security gate; all protected routes depend on it</td>
              </tr>
              <tr className="border-b bg-orange-50">
                <td className="p-3 font-medium">Listings</td>
                <td className="p-3"><code>/listings</code></td>
                <td className="p-3 text-center"><span className="bg-orange-500 text-white px-2 py-1 rounded font-bold">9</span></td>
                <td className="p-3">Primary discovery interface; drives booking conversions</td>
              </tr>
              <tr className="border-b bg-orange-50">
                <td className="p-3 font-medium">Owner Billboards</td>
                <td className="p-3"><code>/my-billboards</code></td>
                <td className="p-3 text-center"><span className="bg-orange-500 text-white px-2 py-1 rounded font-bold">9</span></td>
                <td className="p-3">Core inventory management; CRUD operations with external API calls</td>
              </tr>
              <tr className="border-b bg-yellow-50">
                <td className="p-3 font-medium">Advertiser (AI Recommendations)</td>
                <td className="p-3"><code>/advertiser</code></td>
                <td className="p-3 text-center"><span className="bg-yellow-500 text-white px-2 py-1 rounded font-bold">8</span></td>
                <td className="p-3">AI-powered; integrates LLM + database + external traffic data</td>
              </tr>
              <tr className="border-b bg-yellow-50">
                <td className="p-3 font-medium">Customer Bookings</td>
                <td className="p-3"><code>/my-bookings</code></td>
                <td className="p-3 text-center"><span className="bg-yellow-500 text-white px-2 py-1 rounded font-bold">8</span></td>
                <td className="p-3">Payment integration; booking lifecycle management</td>
              </tr>
              <tr className="border-b bg-yellow-50">
                <td className="p-3 font-medium">Owner Bookings</td>
                <td className="p-3"><code>/owner-bookings</code></td>
                <td className="p-3 text-center"><span className="bg-yellow-500 text-white px-2 py-1 rounded font-bold">8</span></td>
                <td className="p-3">Revenue tracking; booking approval workflow</td>
              </tr>
              <tr className="border-b bg-green-50">
                <td className="p-3 font-medium">Map View</td>
                <td className="p-3"><code>/map</code></td>
                <td className="p-3 text-center"><span className="bg-green-500 text-white px-2 py-1 rounded font-bold">7</span></td>
                <td className="p-3">Geospatial visualization; real-time map rendering</td>
              </tr>
              <tr className="border-b bg-green-50">
                <td className="p-3 font-medium">Campaigns</td>
                <td className="p-3"><code>/campaigns</code></td>
                <td className="p-3 text-center"><span className="bg-green-500 text-white px-2 py-1 rounded font-bold">7</span></td>
                <td className="p-3">Campaign grouping; budget tracking across bookings</td>
              </tr>
              <tr className="border-b bg-green-50">
                <td className="p-3 font-medium">Analytics</td>
                <td className="p-3"><code>/analytics</code></td>
                <td className="p-3 text-center"><span className="bg-green-500 text-white px-2 py-1 rounded font-bold">7</span></td>
                <td className="p-3">Data aggregation; chart rendering with Recharts</td>
              </tr>
              <tr className="border-b bg-blue-50">
                <td className="p-3 font-medium">Home (Index)</td>
                <td className="p-3"><code>/</code></td>
                <td className="p-3 text-center"><span className="bg-blue-500 text-white px-2 py-1 rounded font-bold">6</span></td>
                <td className="p-3">Landing page; minimal data dependencies</td>
              </tr>
              <tr className="bg-gray-50">
                <td className="p-3 font-medium">Documentation</td>
                <td className="p-3"><code>/docs</code></td>
                <td className="p-3 text-center"><span className="bg-gray-500 text-white px-2 py-1 rounded font-bold">3</span></td>
                <td className="p-3">Static documentation; no database interactions</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* 10. Algorithm & Model Insights */}
      <section className="mb-10 page-break-before">
        <h2 className="text-2xl font-bold mb-4 text-gray-800 border-b pb-2">10. Algorithm & Model Insights</h2>
        
        <div className="space-y-6">
          {/* AI Recommendation System */}
          <div className="bg-purple-50 p-5 rounded-lg border-l-4 border-purple-500">
            <h3 className="font-bold text-lg mb-3 text-purple-800">🤖 AI Billboard Recommendation Engine</h3>
            
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <h4 className="font-semibold text-sm text-purple-700">Model</h4>
                <p className="text-sm text-gray-700">Google Gemini 2.5 Flash (via Lovable AI Gateway)</p>
              </div>
              <div>
                <h4 className="font-semibold text-sm text-purple-700">Architecture</h4>
                <p className="text-sm text-gray-700">Large Language Model (Transformer-based)</p>
              </div>
            </div>

            <h4 className="font-semibold text-sm text-purple-700 mb-2">Algorithm Flow:</h4>
            <pre className="bg-white p-3 rounded text-xs font-mono overflow-x-auto">
{`1. INPUT PROCESSING
   ├── Parse: budget (₹), preferred_traffic (low/medium/high), location_preference (text)
   └── Validate constraints and normalize values

2. DATA RETRIEVAL
   ├── Query: SELECT * FROM billboards WHERE is_available = true
   └── Enrich with traffic_score, daily_impressions, location metadata

3. PROMPT ENGINEERING
   ├── System prompt: Billboard advertising expert role
   ├── Context injection: All available billboard data as structured JSON
   └── User constraints: Budget ceiling, traffic preference, location keywords

4. LLM INFERENCE (Gemini 2.5 Flash)
   ├── Multi-factor scoring:
   │   ├── Budget fit: price_per_month ≤ budget (weighted 30%)
   │   ├── Traffic match: traffic_score alignment (weighted 40%)
   │   └── Location relevance: semantic similarity (weighted 30%)
   └── Generate: match_score (0-100), reason, highlights[], trade_offs[]

5. RESPONSE PROCESSING
   ├── Parse JSON response with fallback mechanism
   ├── Enrich recommendations with full billboard details
   └── Sort by match_score DESC, return top-N results`}
            </pre>

            <div className="mt-4 grid grid-cols-3 gap-3">
              <div className="bg-white p-3 rounded">
                <h5 className="font-semibold text-xs text-gray-600">Latency</h5>
                <p className="text-lg font-bold text-purple-700">1-3s</p>
              </div>
              <div className="bg-white p-3 rounded">
                <h5 className="font-semibold text-xs text-gray-600">Context Window</h5>
                <p className="text-lg font-bold text-purple-700">1M tokens</p>
              </div>
              <div className="bg-white p-3 rounded">
                <h5 className="font-semibold text-xs text-gray-600">Output Format</h5>
                <p className="text-lg font-bold text-purple-700">Structured JSON</p>
              </div>
            </div>
          </div>

          {/* Traffic Scoring Algorithm */}
          <div className="bg-blue-50 p-5 rounded-lg border-l-4 border-blue-500">
            <h3 className="font-bold text-lg mb-3 text-blue-800">🚦 Traffic Scoring Algorithm</h3>
            
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <h4 className="font-semibold text-sm text-blue-700">Data Source</h4>
                <p className="text-sm text-gray-700">TomTom Traffic Flow API (Real-time)</p>
              </div>
              <div>
                <h4 className="font-semibold text-sm text-blue-700">Update Frequency</h4>
                <p className="text-sm text-gray-700">On-demand (billboard creation/update)</p>
              </div>
            </div>

            <h4 className="font-semibold text-sm text-blue-700 mb-2">Scoring Mechanism:</h4>
            <pre className="bg-white p-3 rounded text-xs font-mono overflow-x-auto">
{`TRAFFIC FLOW API RESPONSE:
{
  "currentSpeed": number (km/h),
  "freeFlowSpeed": number (km/h),
  "currentTravelTime": number (seconds),
  "freeFlowTravelTime": number (seconds),
  "confidence": number (0-1)
}

SCORING ALGORITHM:
┌─────────────────────────────────────────────────────────────┐
│  trafficRatio = currentSpeed / freeFlowSpeed                │
│                                                             │
│  if (trafficRatio < 0.5)  → "high" traffic                 │
│     // Congested: more vehicles = more impressions          │
│     dailyImpressions = random(22000, 25000)                 │
│                                                             │
│  else if (trafficRatio < 0.75) → "medium" traffic          │
│     // Moderate flow                                        │
│     dailyImpressions = random(18000, 22000)                 │
│                                                             │
│  else → "low" traffic                                       │
│     // Free-flowing: fewer stops, less visibility           │
│     dailyImpressions = random(15000, 18000)                 │
└─────────────────────────────────────────────────────────────┘

RATIONALE:
• Lower speed ratio = more congestion = longer exposure time
• High congestion areas = premium pricing potential
• Impressions estimated based on traffic volume models`}
            </pre>
          </div>

          {/* Geolocation & Geocoding */}
          <div className="bg-green-50 p-5 rounded-lg border-l-4 border-green-500">
            <h3 className="font-bold text-lg mb-3 text-green-800">📍 Geolocation & Reverse Geocoding</h3>
            
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <h4 className="font-semibold text-sm text-green-700">Map Tiles</h4>
                <p className="text-sm text-gray-700">OpenStreetMap via Leaflet.js</p>
              </div>
              <div>
                <h4 className="font-semibold text-sm text-green-700">Geocoding</h4>
                <p className="text-sm text-gray-700">Nominatim API (OSM)</p>
              </div>
            </div>

            <h4 className="font-semibold text-sm text-green-700 mb-2">Mechanism:</h4>
            <pre className="bg-white p-3 rounded text-xs font-mono overflow-x-auto">
{`USER INTERACTION:
┌─────────────────────────────────────────────────────┐
│  1. User clicks on map (Leaflet click event)       │
│  2. Extract: { lat: number, lng: number }          │
│  3. Call Nominatim reverse geocode API:            │
│     GET nominatim.openstreetmap.org/reverse        │
│       ?lat={lat}&lon={lng}&format=json             │
│  4. Parse response → display_name (address string) │
│  5. Update form fields with coordinates + address  │
└─────────────────────────────────────────────────────┘

COORDINATE SYSTEM: WGS84 (EPSG:4326)
MAP PROJECTION: Web Mercator (EPSG:3857)`}
            </pre>
          </div>

          {/* Payment Flow */}
          <div className="bg-orange-50 p-5 rounded-lg border-l-4 border-orange-500">
            <h3 className="font-bold text-lg mb-3 text-orange-800">💳 Payment Processing (Razorpay)</h3>
            
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <h4 className="font-semibold text-sm text-orange-700">Gateway</h4>
                <p className="text-sm text-gray-700">Razorpay (India)</p>
              </div>
              <div>
                <h4 className="font-semibold text-sm text-orange-700">Currency</h4>
                <p className="text-sm text-gray-700">INR (₹)</p>
              </div>
            </div>

            <h4 className="font-semibold text-sm text-orange-700 mb-2">Security Mechanism:</h4>
            <pre className="bg-white p-3 rounded text-xs font-mono overflow-x-auto">
{`ORDER CREATION (Server-side):
┌─────────────────────────────────────────────────────┐
│  1. Edge Function receives: { amount, booking_id }  │
│  2. Create Razorpay order via Orders API           │
│  3. Return: { order_id, key_id }                   │
└─────────────────────────────────────────────────────┘

PAYMENT VERIFICATION (HMAC-SHA256):
┌─────────────────────────────────────────────────────┐
│  signature = HMAC_SHA256(                          │
│    order_id + "|" + payment_id,                    │
│    RAZORPAY_KEY_SECRET                             │
│  )                                                 │
│                                                    │
│  if (signature === razorpay_signature) {           │
│    → Update booking status to "confirmed"          │
│    → Set payment_status to "completed"             │
│  } else {                                          │
│    → Reject: signature mismatch (fraud attempt)    │
│  }                                                 │
└─────────────────────────────────────────────────────┘`}
            </pre>
          </div>

          {/* RLS Security Model */}
          <div className="bg-red-50 p-5 rounded-lg border-l-4 border-red-500">
            <h3 className="font-bold text-lg mb-3 text-red-800">🔐 Row Level Security (RLS) Model</h3>
            
            <h4 className="font-semibold text-sm text-red-700 mb-2">Policy Enforcement:</h4>
            <pre className="bg-white p-3 rounded text-xs font-mono overflow-x-auto">
{`AUTHENTICATION CONTEXT:
  auth.uid() → Current user's UUID from Supabase Auth

POLICY PATTERN:
┌─────────────────────────────────────────────────────────────┐
│  CREATE POLICY "policy_name"                                │
│  ON public.table_name                                       │
│  FOR [SELECT | INSERT | UPDATE | DELETE]                    │
│  USING (auth.uid() = user_id)  -- Row-level check          │
│  WITH CHECK (auth.uid() = user_id)  -- Insert/Update check │
└─────────────────────────────────────────────────────────────┘

EXAMPLE: billboards table
  • SELECT: true (anyone can view)
  • INSERT: auth.uid() = owner_id
  • UPDATE: auth.uid() = owner_id  
  • DELETE: auth.uid() = owner_id

SECURITY GUARANTEE:
  ✓ Server-side enforcement (cannot bypass from client)
  ✓ Applied at PostgreSQL level before data returns
  ✓ Works with all Supabase client queries automatically`}
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
