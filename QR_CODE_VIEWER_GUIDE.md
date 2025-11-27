# 📱 QR Code Viewer & Campaign Link Generator

## 🎉 New Feature Added!

You can now view and download QR codes for any link you've created, with full campaign tracking flexibility!

## 🚀 How to Use

### 1. Access the QR Code Viewer
1. Go to your **Dashboard**
2. Navigate to the **Links Manager** tab
3. Find the link you want to view
4. Click the **QR Code icon** (orange icon) in the Actions column

### 2. Generate Campaign-Specific QR Codes
The QR Code Viewer modal provides:

#### **QR Code Display**
- High-quality QR code (300x300 pixels at 1000x1000 download)
- Includes your app logo in the center (if you've uploaded one)
- Real-time preview of the selected campaign

#### **Campaign Source Selector**
Choose from 15+ pre-configured sources:
- **Direct** (no source parameter)
- **Social Media**: TikTok, Instagram, Facebook, YouTube, Twitter/X, LinkedIn, Snapchat
- **Messaging**: WhatsApp, Telegram, SMS
- **Marketing**: Email Campaign, Print Materials, Billboard/Outdoor
- **Custom**: Define your own source name

#### **Generated Campaign Link**
- Automatically generates the link with the selected source
- Format: `https://yourdomain.com/l/{id}?s={source}`
- One-click copy to clipboard

### 3. Download QR Codes
- Click **"Download QR Code"** button
- Downloads as high-quality PNG (1000x1000 pixels)
- Filename includes the link title and source: `qr-my-app-tiktok.png`
- Perfect for print and digital use

## 📊 How Campaign Tracking Works

### URL Parameters
When you select a source, it adds a `?s={source}` parameter to the URL:
- Direct: `https://yourdomain.com/l/abc123`
- TikTok: `https://yourdomain.com/l/abc123?s=tiktok`
- Custom: `https://yourdomain.com/l/abc123?s=radio-ad`

### Analytics Tracking
Every click is tracked in your dashboard with:
- **Platform** (iOS, Android, Web)
- **Source** (TikTok, Instagram, Direct, etc.)
- **Location** (Country, City)
- **Timestamp**

### View Results
Check the **Sources** tab in your dashboard to see which campaigns drive the most clicks!

## 💡 Use Cases

### 1. Multi-Channel Marketing
Generate different QR codes for:
- Instagram Stories → `?s=instagram`
- TikTok Bio → `?s=tiktok`
- YouTube Description → `?s=youtube`
- Email Newsletter → `?s=email`

Track which channel performs best!

### 2. Print vs Digital
Compare performance:
- Flyers → `?s=print`
- Billboards → `?s=billboard`
- Digital Ads → `?s=digital-ad`

### 3. Event Tracking
Create unique sources for each event:
- Trade Show Booth → `?s=trade-show-2025`
- Conference → `?s=conference-booth`
- Product Launch → `?s=product-launch`

### 4. A/B Testing
Test different placements:
- Top of Page → `?s=header`
- Bottom of Page → `?s=footer`
- Sidebar → `?s=sidebar`

## 🎨 Custom Sources

For maximum flexibility, use **Custom Source**:
1. Select "Custom Source" from the dropdown
2. Enter your source name (e.g., `radio-ad`, `event-booth`)
3. System automatically converts to lowercase with hyphens
4. Perfect for unique campaigns

**Examples:**
- `radio-ad` → Track radio advertising
- `event-booth` → Track specific event booths
- `partner-xyz` → Track partner referrals
- `season-promo` → Track seasonal promotions

## 📈 Best Practices

1. **Use Clear Names**: Choose descriptive source names
2. **Be Consistent**: Use the same format across campaigns
3. **Track Everything**: Create a unique source for each placement
4. **Review Analytics**: Check your dashboard regularly to optimize
5. **Test First**: Download and test QR codes before printing

## 🔧 Technical Details

### QR Code Specifications
- **Size**: 300x300 pixels (display), 1000x1000 pixels (download)
- **Error Correction**: High (H level)
- **Format**: PNG
- **Logo**: Automatically centered (60x60 pixels in download)

### URL Structure
- **Base URL**: `https://yourdomain.com/l/{link_id}`
- **With Source**: `https://yourdomain.com/l/{link_id}?s={source_name}`
- **Query Parameter**: `s` (source)

### Data Tracking
All clicks are logged to the `clicks` table with:
```typescript
{
  link_id: string,
  platform: 'ios' | 'android' | 'web',
  source: string,  // From ?s= parameter or 'direct'
  country: string,
  city: string,
  user_agent: string,
  created_at: timestamp
}
```

## 🎯 Quick Start Example

1. **Create a TikTok Campaign**:
   - Open QR Code Viewer for your link
   - Select "TikTok" from dropdown
   - Download the QR code
   - Post it in your TikTok bio

2. **Create an Instagram Campaign**:
   - Open QR Code Viewer (same link)
   - Select "Instagram"
   - Download this QR code
   - Post it in Instagram Stories

3. **View Results**:
   - Go to Dashboard → Sources tab
   - See TikTok vs Instagram performance
   - Optimize your strategy!

## ⚡ Pro Tips

- **Print Quality**: QR codes download at 1000x1000 - high enough for most print materials
- **Test Before Printing**: Always scan the QR code before mass printing
- **Multiple Sources**: You can create unlimited campaign variations for the same link
- **Real-time Updates**: Changes to your link (URLs, logo) automatically update all QR codes
- **No Duplicates Needed**: Use the same link with different sources instead of creating duplicate links

---

**This feature gives you enterprise-level campaign tracking without the enterprise price tag!** 🚀
