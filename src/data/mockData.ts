import { Product, Customer, Order, Coupon } from '../types/ecommerce';

export const HERO_IMAGE = '/src/assets/images/hero_luxury_atelier_1793815699829.jpg';
export const PROMO_BANNER_IMAGE = '/src/assets/images/promo_editorial_banner_1793815700883.jpg';

export const MOCK_PRODUCTS: Product[] = [
  {
    id: 'prod-001',
    title: 'Cashmere-Wool Tailored Overcoat',
    slug: 'cashmere-wool-tailored-overcoat',
    subtitle: 'Double-faced Italian melange wool with hand-finished notch lapels',
    description: 'Masterfully structured from an ultra-soft blend of 85% virgin wool and 15% Mongolian cashmere. Designed with an unstructured shoulder for effortless layering over tailoring or knitwear, featuring horn buttons, deep welt pockets, and a clean single vent back.',
    price: 890,
    originalPrice: 1150,
    category: 'Apparel & Tailoring',
    categorySlug: 'apparel',
    sku: 'AUR-COAT-01',
    rating: 4.9,
    reviewCount: 42,
    images: [
      '/src/assets/images/product_wool_overcoat_1793815700035.jpg',
      '/src/assets/images/hero_luxury_atelier_1793815699829.jpg',
    ],
    colors: [
      { name: 'Oat Melange', hex: '#D6C8B5', bgClass: 'bg-[#D6C8B5]' },
      { name: 'Charcoal Slate', hex: '#373E47', bgClass: 'bg-[#373E47]' },
      { name: 'Obsidian Black', hex: '#1C1C1E', bgClass: 'bg-[#1C1C1E]' }
    ],
    sizes: ['38 / S', '40 / M', '42 / L', '44 / XL'],
    stock: 7,
    isBestSeller: true,
    isTrending: true,
    materials: '85% Virgin Wool, 15% Mongolian Grade-A Cashmere. Cupro lining.',
    dimensions: 'Length: 112cm (Size 40). Relaxed tailored fit.',
    care: 'Specialist dry clean only. Store on shaped wooden hanger with breathable garment cover.',
    origin: 'Hand-tailored in Biella, Northern Italy',
    reviews: [
      {
        id: 'rev-01',
        author: 'Julian M.',
        location: 'Zurich, Switzerland',
        rating: 5,
        date: 'Oct 14, 2026',
        verified: true,
        title: 'Exquisite drape and unparalleled craftsmanship',
        comment: 'The weight of the double-faced wool is substantial yet moves fluidly. The oat tone is warm and neutral, pairing seamlessly with both charcoal suits and raw denim.',
        helpfulCount: 18
      },
      {
        id: 'rev-02',
        author: 'Helena S.',
        location: 'Stockholm, Sweden',
        rating: 5,
        date: 'Sep 29, 2026',
        verified: true,
        title: 'Worth every single penny',
        comment: 'Every seam is immaculately finished. Warm enough for Scandinavian early winter without feeling cumbersome.',
        helpfulCount: 9
      }
    ]
  },
  {
    id: 'prod-002',
    title: 'Artisanal Fluted Ceramic Vessel Lamp',
    slug: 'artisanal-fluted-ceramic-vessel-lamp',
    subtitle: 'Hand-sculpted stoneware base with natural handmade parchment shade',
    description: 'Each ceramic lamp body is individually hand-thrown and ribbed by master ceramists in Kyoto, finished in a matte raw glaze that celebrates tactile imperfections. Complete with an untreated brass pull switch and a woven linen cord.',
    price: 460,
    originalPrice: 520,
    category: 'Architectural Living',
    categorySlug: 'living',
    sku: 'AUR-LAMP-02',
    rating: 4.8,
    reviewCount: 28,
    images: [
      '/src/assets/images/product_ceramic_lamp_1793815699947.jpg',
      '/src/assets/images/hero_luxury_atelier_1793815699829.jpg'
    ],
    colors: [
      { name: 'Chalk White', hex: '#EBE7DF', bgClass: 'bg-[#EBE7DF]' },
      { name: 'Warm Terracotta', hex: '#B87860', bgClass: 'bg-[#B87860]' },
      { name: 'Basalt Black', hex: '#2B2B2B', bgClass: 'bg-[#2B2B2B]' }
    ],
    sizes: ['Standard Table (H 48cm)', 'Monumental (H 62cm)'],
    stock: 4,
    isNew: true,
    isTrending: true,
    materials: 'High-fire stoneware ceramic, untreated natural brass fittings, washi parchment shade.',
    dimensions: 'Height: 48cm, Shade Diameter: 32cm, Base Diameter: 19cm. Cord length: 2.2m.',
    care: 'Dust with a soft microfiber cloth. LED E27 warm white bulb included (2700K).',
    origin: 'Handmade in Kyoto, Japan',
    reviews: [
      {
        id: 'rev-03',
        author: 'Marcus K.',
        location: 'Copenhagen, Denmark',
        rating: 5,
        date: 'Oct 22, 2026',
        verified: true,
        title: 'Transforms the ambient energy of the living room',
        comment: 'The texture of the clay catches grazing light stunningly. The parchment shade casts the warmest 2700K diffused glow.',
        helpfulCount: 14
      }
    ]
  },
  {
    id: 'prod-003',
    title: 'Cognac Saddle Leather Weekender Bag',
    slug: 'cognac-saddle-leather-weekender-bag',
    subtitle: 'Full-grain vegetable-tanned Tuscan leather with solid brushed brass accents',
    description: 'Crafted for seamless travel and weekend retreats. Formed from supple 2.2mm Tuscan vegetable-tanned steerhide that develops an irreplaceable golden patina over years of use. Features a reinforced dual-zip clamshell opening, padded laptop partition, and removable shoulder strap.',
    price: 740,
    category: 'Handcrafted Leather',
    categorySlug: 'leather',
    sku: 'AUR-BAG-03',
    rating: 5.0,
    reviewCount: 36,
    images: [
      '/src/assets/images/product_leather_tote_1793815701279.jpg',
      '/src/assets/images/promo_editorial_banner_1793815700883.jpg'
    ],
    colors: [
      { name: 'Cognac Tan', hex: '#9C582B', bgClass: 'bg-[#9C582B]' },
      { name: 'Espresso Brown', hex: '#442F24', bgClass: 'bg-[#442F24]' },
      { name: 'Noir Matte', hex: '#1B1B1B', bgClass: 'bg-[#1B1B1B]' }
    ],
    sizes: ['42L Weekend Carry-On', '52L Extended Expedition'],
    stock: 9,
    isBestSeller: true,
    materials: 'Tuscan full-grain vegetable-tanned leather, heavy 14oz organic cotton canvas interior, YKK Excella brass zippers.',
    dimensions: '52cm x 31cm x 26cm. Compliant with international airline cabin regulations.',
    care: 'Condition annually with natural beeswax or organic leather balm. Avoid sustained moisture.',
    origin: 'Handcrafted in Florence, Italy',
    reviews: [
      {
        id: 'rev-04',
        author: 'David L.',
        location: 'London, UK',
        rating: 5,
        date: 'Nov 01, 2026',
        verified: true,
        title: 'A generational piece of luggage',
        comment: 'The scent of the vegetable-tanned leather is intoxicating. Already taken on four flights; fits effortlessly in overhead compartments.',
        helpfulCount: 22
      }
    ]
  },
  {
    id: 'prod-004',
    title: 'Pleated Belgian Linen Relaxed Trouser',
    slug: 'pleated-belgian-linen-relaxed-trouser',
    subtitle: 'High-waisted double forward pleats with side tab buckle adjusters',
    description: 'Cut from heavyweight 290gsm artisanal Belgian flax linen with an elegant natural slub texture. Designed with a generous thigh and gentle taper toward the hem. Featuring horn buttons, internal curtain waistband, and genuine horn side adjusters.',
    price: 380,
    category: 'Apparel & Tailoring',
    categorySlug: 'apparel',
    sku: 'AUR-PNT-04',
    rating: 4.7,
    reviewCount: 19,
    images: [
      '/src/assets/images/promo_editorial_banner_1793815700883.jpg',
      '/src/assets/images/hero_luxury_atelier_1793815699829.jpg'
    ],
    colors: [
      { name: 'Sand Dune', hex: '#D7CBB7', bgClass: 'bg-[#D7CBB7]' },
      { name: 'Olive Drab', hex: '#585949', bgClass: 'bg-[#585949]' },
      { name: 'Bleached Bone', hex: '#F0ECE4', bgClass: 'bg-[#F0ECE4]' }
    ],
    sizes: ['28', '30', '32', '34', '36'],
    stock: 12,
    isNew: true,
    materials: '100% Certified Masters of Linen® Belgian Flax. Unlined body.',
    dimensions: 'Inside leg: 82cm with 5cm unhemmed allowance for tailor adjustment.',
    care: 'Gentle cold hand wash or eco dry clean. Air dry in shade; warm steam iron while damp.',
    origin: 'Woven in Kortrijk, Belgium. Assembled in Portugal.'
  },
  {
    id: 'prod-005',
    title: 'Minimalist Nappa Calfskin Low Sneaker',
    slug: 'minimalist-nappa-calfskin-low-sneaker',
    subtitle: 'Monochrome cupsole sneaker with margom rubber outsole and leather lining',
    description: 'The pinnacle of understated luxury footwear. Hand-lasted in Civitanova Marche using buttery Italian full-grain nappa leather. Features butter-soft calfskin lining, cushioned memory foam insole, and authentic Italian Margom vulcanized rubber soles.',
    price: 420,
    originalPrice: 480,
    category: 'Footwear & Accents',
    categorySlug: 'footwear',
    sku: 'AUR-SHOE-05',
    rating: 4.9,
    reviewCount: 51,
    images: [
      '/src/assets/images/hero_luxury_atelier_1793815699829.jpg',
      '/src/assets/images/product_wool_overcoat_1793815700035.jpg'
    ],
    colors: [
      { name: 'Alabaster Chalk', hex: '#F3F2EE', bgClass: 'bg-[#F3F2EE]' },
      { name: 'Raw Umber', hex: '#634936', bgClass: 'bg-[#634936]' },
      { name: 'Graphite', hex: '#2A2B2D', bgClass: 'bg-[#2A2B2D]' }
    ],
    sizes: ['EU 40 / US 7.5', 'EU 41 / US 8.5', 'EU 42 / US 9.5', 'EU 43 / US 10.5', 'EU 44 / US 11.5'],
    stock: 8,
    isBestSeller: true,
    isTrending: true,
    materials: 'Full-grain Italian nappa leather, vegetable-tanned calfskin lining, Margom rubber sole.',
    dimensions: 'Sole thickness: 30mm. True to European sizing.',
    care: 'Wipe with damp cloth. Apply neutral shoe cream and maintain shape with cedar shoe trees.',
    origin: 'Civitanova Marche, Italy'
  },
  {
    id: 'prod-006',
    title: 'Carved Solid Travertine Catchall Bowl',
    slug: 'carved-solid-travertine-catchall-bowl',
    subtitle: 'Monolithic raw Roman travertine block hand-carved with gentle hollow curve',
    description: 'Chiseled from single blocks of unsealed Tivoli travertine, showcasing organic sedimentary cavities and natural veining that ensures no two specimens are identical. Perfectly sized for keys, jewelry, or as a standalone architectural centerpiece.',
    price: 240,
    category: 'Architectural Living',
    categorySlug: 'living',
    sku: 'AUR-OBJ-06',
    rating: 4.8,
    reviewCount: 15,
    images: [
      '/src/assets/images/hero_luxury_atelier_1793815699829.jpg',
      '/src/assets/images/product_ceramic_lamp_1793815699947.jpg'
    ],
    colors: [
      { name: 'Natural Travertine', hex: '#E2D7C5', bgClass: 'bg-[#E2D7C5]' },
      { name: 'Nero Marquina Marble', hex: '#1C1F22', bgClass: 'bg-[#1C1F22]' }
    ],
    sizes: ['Diameter 22cm', 'Diameter 30cm Grand'],
    stock: 5,
    isNew: false,
    materials: '100% Solid Italian Tivoli Travertine. Protective cork base pads.',
    dimensions: '22cm x 22cm x 5.5cm. Approximate weight: 2.4kg.',
    care: 'Clean with mild pH-neutral stone cleaner. Do not expose to acidic liquids or citrus.',
    origin: 'Tivoli, Italy'
  },
  {
    id: 'prod-007',
    title: 'Minimalist Vegetable-Tanned Bifold Wallet',
    slug: 'minimalist-vegetable-tanned-bifold-wallet',
    subtitle: 'Ultra-slim profile card case with hand-beveled and burnished edges',
    description: 'Constructed from 1.2mm French buttero calfskin. Features six precision-cut credit card slots, two hidden multi-currency pockets, and hand-stitched linen thread saddle stitching that will never unravel.',
    price: 195,
    category: 'Handcrafted Leather',
    categorySlug: 'leather',
    sku: 'AUR-WLT-07',
    rating: 4.9,
    reviewCount: 33,
    images: [
      '/src/assets/images/product_leather_tote_1793815701279.jpg',
      '/src/assets/images/product_wool_overcoat_1793815700035.jpg'
    ],
    colors: [
      { name: 'Cognac', hex: '#9C582B', bgClass: 'bg-[#9C582B]' },
      { name: 'British Racing Green', hex: '#1E3B2B', bgClass: 'bg-[#1E3B2B]' },
      { name: 'Matte Black', hex: '#141414', bgClass: 'bg-[#141414]' }
    ],
    sizes: ['One Size (10.5cm x 8cm)'],
    stock: 15,
    isTrending: true,
    materials: 'French Buttero full-grain calf leather, waxed Fil Au Chinois linen thread.',
    dimensions: '10.5cm x 8.0cm x 0.7cm (closed).',
    care: 'Condition with mink oil or neutral wax sparingly.',
    origin: 'Lyon, France'
  },
  {
    id: 'prod-008',
    title: 'Chunky Ribbed Cashmere Crewneck',
    slug: 'chunky-ribbed-cashmere-crewneck',
    subtitle: '7-gauge 4-ply Scottish cashmere spun by Todd & Duncan',
    description: 'An enduring staple knitted on traditional hand-flat machines in the Scottish Borders. Heavyweight 4-ply yarn delivers unrivaled thermal warmth with an airy, cloud-like loft that resists pilling.',
    price: 590,
    originalPrice: 650,
    category: 'Apparel & Tailoring',
    categorySlug: 'apparel',
    sku: 'AUR-KNT-08',
    rating: 5.0,
    reviewCount: 27,
    images: [
      '/src/assets/images/product_wool_overcoat_1793815700035.jpg',
      '/src/assets/images/hero_luxury_atelier_1793815699829.jpg'
    ],
    colors: [
      { name: 'Oatmeal', hex: '#E4DDD0', bgClass: 'bg-[#E4DDD0]' },
      { name: 'Navy Melange', hex: '#1C2638', bgClass: 'bg-[#1C2638]' },
      { name: 'Forest Loden', hex: '#313C2F', bgClass: 'bg-[#313C2F]' }
    ],
    sizes: ['S', 'M', 'L', 'XL'],
    stock: 3,
    isBestSeller: true,
    materials: '100% Grade-A 4-ply Mongolian Cashmere spun in Loch Leven, Scotland.',
    dimensions: 'Regular fit. Ribbed neck, hem, and cuffs.',
    care: 'Hand wash cold with cashmere wool wash or dry clean. Dry flat on a towel.',
    origin: 'Hawick, Scotland'
  }
];

export const MOCK_CATEGORIES = [
  {
    id: 'cat-1',
    name: 'Apparel & Tailoring',
    slug: 'apparel',
    description: 'Structural overcoats, relaxed pleated trousers, and heirloom knitwear made from raw European fibres.',
    itemCount: 24,
    image: '/src/assets/images/product_wool_overcoat_1793815700035.jpg'
  },
  {
    id: 'cat-2',
    name: 'Handcrafted Leather',
    slug: 'leather',
    description: 'Tuscan vegetable-tanned weekender bags, precision card cases, and heritage leather accoutrements.',
    itemCount: 16,
    image: '/src/assets/images/product_leather_tote_1793815701279.jpg'
  },
  {
    id: 'cat-3',
    name: 'Architectural Living',
    slug: 'living',
    description: 'Kyoto ceramic vessel lighting, monolithic raw travertine bowls, and contemplative spatial objects.',
    itemCount: 19,
    image: '/src/assets/images/product_ceramic_lamp_1793815699947.jpg'
  },
  {
    id: 'cat-4',
    name: 'Footwear & Accents',
    slug: 'footwear',
    description: 'Hand-lasted Italian nappa leather sneakers, Goodyear-welted boots, and minimal silver accents.',
    itemCount: 12,
    image: '/src/assets/images/promo_editorial_banner_1793815700883.jpg'
  }
];

export const MOCK_COUPONS: Coupon[] = [
  {
    code: 'AURA10',
    discountPercent: 10,
    description: '10% private client seasonal discount',
    minSpend: 200
  },
  {
    code: 'ATELIER30',
    discountAmount: 30,
    description: '$30 welcome benefit for first order',
    minSpend: 150
  },
  {
    code: 'VIP50',
    discountAmount: 50,
    description: '$50 VIP loyalty privilege on orders over $500',
    minSpend: 500
  }
];

export const INITIAL_USER: Customer = {
  id: 'usr-101',
  name: 'Eleanor Vance',
  email: 'eleanor.vance@atelier-arch.com',
  phone: '+1 (415) 890-3321',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200',
  tier: 'Gold Atelier',
  rewardPoints: 1420,
  totalOrders: 6,
  joinedDate: 'September 2025',
  addresses: [
    {
      id: 'addr-1',
      title: 'Studio & Residence',
      fullName: 'Eleanor Vance',
      phone: '+1 (415) 890-3321',
      street: '742 Montgomery Street',
      apartment: 'Penthouse 4B',
      city: 'San Francisco',
      state: 'CA',
      postalCode: '94111',
      country: 'United States',
      isDefault: true
    },
    {
      id: 'addr-2',
      title: 'Summer House',
      fullName: 'Eleanor Vance',
      phone: '+1 (415) 890-3321',
      street: '128 Ocean View Ave',
      city: 'Carmel-by-the-Sea',
      state: 'CA',
      postalCode: '93921',
      country: 'United States',
      isDefault: false
    }
  ]
};

export const INITIAL_ORDERS: Order[] = [
  {
    id: 'ord-8921',
    orderNumber: 'AUR-89210-CH',
    date: 'Nov 02, 2026',
    status: 'Shipped',
    items: [
      {
        id: 'cart-init-1',
        product: MOCK_PRODUCTS[0],
        selectedColor: MOCK_PRODUCTS[0].colors[0],
        selectedSize: '40 / M',
        quantity: 1
      },
      {
        id: 'cart-init-2',
        product: MOCK_PRODUCTS[1],
        selectedColor: MOCK_PRODUCTS[1].colors[0],
        selectedSize: 'Standard Table (H 48cm)',
        quantity: 1
      }
    ],
    subtotal: 1350,
    shippingCost: 0,
    shippingMethod: 'DHL Express Insured Worldwide (Complimentary)',
    discount: 50,
    tax: 104,
    total: 1404,
    shippingAddress: {
      fullName: 'Eleanor Vance',
      email: 'eleanor.vance@atelier-arch.com',
      phone: '+1 (415) 890-3321',
      street: '742 Montgomery Street',
      apartment: 'Penthouse 4B',
      city: 'San Francisco',
      state: 'CA',
      postalCode: '94111',
      country: 'United States'
    },
    paymentMethod: 'Mastercard ending in ···· 8492',
    trackingNumber: 'DHL-EX-9928174620',
    carrier: 'DHL Express Worldwide',
    estimatedDelivery: 'Nov 06, 2026 · Before 12:00 PM',
    checkpoints: [
      {
        id: 'chk-1',
        status: 'Order Placed & Verified',
        location: 'Atelier Central Facility · Milan',
        timestamp: 'Nov 02, 2026 · 09:14 AM CET',
        description: 'Payment authorized and items assigned to master packaging team.',
        completed: true
      },
      {
        id: 'chk-2',
        status: 'Quality Control & Wax Sealing',
        location: 'Atelier Inspection Depot · Milan',
        timestamp: 'Nov 02, 2026 · 02:40 PM CET',
        description: 'Hand inspection verified. Certificate of authenticity enclosed in garment pouch.',
        completed: true
      },
      {
        id: 'chk-3',
        status: 'Departed International Sort Facility',
        location: 'Malpensa Airport (MXP) · Milan',
        timestamp: 'Nov 03, 2026 · 06:15 AM CET',
        description: 'Shipment has departed originating gateway via Flight DHL-8201.',
        completed: true
      },
      {
        id: 'chk-4',
        status: 'Customs Clearance Processed',
        location: 'San Francisco International Gateway (SFO)',
        timestamp: 'Nov 04, 2026 · 07:30 AM PST',
        description: 'Customs cleared with zero duties pending. Forwarded to local distribution hub.',
        completed: true
      },
      {
        id: 'chk-5',
        status: 'Out for Priority Delivery',
        location: 'Financial District Facility · San Francisco',
        timestamp: 'Nov 06, 2026 · Scheduled',
        description: 'Courier route assigned. Signature required upon receipt.',
        completed: false
      }
    ]
  },
  {
    id: 'ord-8104',
    orderNumber: 'AUR-81044-US',
    date: 'Oct 11, 2026',
    status: 'Delivered',
    items: [
      {
        id: 'cart-init-3',
        product: MOCK_PRODUCTS[2],
        selectedColor: MOCK_PRODUCTS[2].colors[0],
        selectedSize: '42L Weekend Carry-On',
        quantity: 1
      }
    ],
    subtotal: 740,
    shippingCost: 0,
    shippingMethod: 'Express Insured Delivery',
    discount: 0,
    tax: 59.2,
    total: 799.2,
    shippingAddress: {
      fullName: 'Eleanor Vance',
      email: 'eleanor.vance@atelier-arch.com',
      phone: '+1 (415) 890-3321',
      street: '742 Montgomery Street',
      apartment: 'Penthouse 4B',
      city: 'San Francisco',
      state: 'CA',
      postalCode: '94111',
      country: 'United States'
    },
    paymentMethod: 'Apple Pay (Visa ···· 1042)',
    trackingNumber: 'DHL-EX-8812304911',
    carrier: 'DHL Express',
    estimatedDelivery: 'Oct 15, 2026 · Delivered',
    checkpoints: [
      {
        id: 'chk-d1',
        status: 'Delivered to Recipient',
        location: 'San Francisco, CA',
        timestamp: 'Oct 15, 2026 · 11:22 AM PST',
        description: 'Signed for by E. Vance. Parcel placed in private concierge.',
        completed: true
      }
    ]
  }
];

export const MOCK_ADMIN_METRICS = {
  totalRevenue: 128450,
  monthlyGrowth: '+18.4%',
  ordersThisMonth: 342,
  averageOrderValue: 584,
  customerRetention: '76.8%',
  lowStockItemsCount: 4,
  salesTrend: [
    { month: 'Jun', sales: 68000, orders: 190 },
    { month: 'Jul', sales: 74500, orders: 215 },
    { month: 'Aug', sales: 89000, orders: 260 },
    { month: 'Sep', sales: 104200, orders: 295 },
    { month: 'Oct', sales: 118900, orders: 320 },
    { month: 'Nov (Proj)', sales: 134000, orders: 360 }
  ]
};
