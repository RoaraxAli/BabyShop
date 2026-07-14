"use client";

import { Bot, Heart, Home, Package, Search, ShoppingBag, Truck, UserRound, ShoppingCart, Trash2, X, Plus, Minus, ArrowRight, ShieldCheck, HeartHandshake, Menu, Baby } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState, Suspense } from "react";
import { Footer } from "@/components/Footer";
import { Nav } from "@/components/Nav";
import { useAuth } from "@/components/AuthProvider";
import { categories, products as initialMockProducts } from "@/lib/data";
import { collection, doc, getDocs, setDoc, addDoc, getDoc, query, where, writeBatch, serverTimestamp, onSnapshot } from "firebase/firestore";
import { db } from "@/lib/firebase";

type Product = {
  id: string;
  name: string;
  tag: string;
  price: string;
  description: string;
  image: string;
  category: string;
  stock: number;
};

type CartItem = {
  product: Product;
  quantity: number;
};

type Order = {
  id: string;
  items: { name: string; price: string; quantity: number }[];
  total: number;
  address: string;
  status: string;
  createdAt: any;
};

function ShopPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, loading, logout } = useAuth();
  const [activeTab, setActiveTab] = useState<"home" | "shop" | "wishlist" | "orders" | "assistant" | "profile">("home");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  
  useEffect(() => {
    const tab = searchParams.get('tab');
    if (tab) {
      if (["home", "shop", "wishlist", "orders", "assistant", "profile"].includes(tab)) {
        setActiveTab(tab as any);
      } else if (tab === 'cart') {
        setIsCartOpen(true);
      }
    }
  }, [searchParams]);

  // Products & Category State
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [productsLoading, setProductsLoading] = useState(true);

  // Cart & Wishlist State
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [wishlistIds, setWishlistIds] = useState<string[]>([]);
  const [userProfile, setUserProfile] = useState<any>(null);

  // Order & Checkout State
  const [orders, setOrders] = useState<Order[]>([]);
  const [settings, setSettings] = useState({
    supportEmail: "support@babyshophub.com",
    contactPhone: "+1 (555) 019-2834",
    currencySymbol: "$",
    enableReviews: true,
    showOutOfStock: true,
    requireEmailVerification: false,
    enableFreeShipping: true,
  });

  useEffect(() => {
    async function loadSettings() {
      try {
        const snap = await getDoc(doc(db, "admin_settings", "store"));
        if (snap.exists()) {
          setSettings((current) => ({ ...current, ...snap.data() }));
        }
      } catch (err) {
        console.error("Error loading settings:", err);
      }
    }
    loadSettings();
  }, []);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [shippingAddress, setShippingAddress] = useState("");
  const [cardName, setCardName] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCvv, setCardCvv] = useState("");
  const [checkoutStatus, setCheckoutStatus] = useState("");
  const [isCheckingOut, setIsCheckingOut] = useState(false);

  // AI Chat State
  const [chatMessages, setChatMessages] = useState<{ sender: "bot" | "user"; text: string }[]>([
    { sender: "bot", text: "Hello! I am your BabyShopHub Personal Assistant. Ask me anything about our diapers, organic baby foods, sizing, shipping, or returns!" }
  ]);
  const [chatInput, setChatInput] = useState("");

  // Profile Form States
  const [profileName, setProfileName] = useState("");
  const [profileAddress, setProfileAddress] = useState("");
  const [mfaEnabled, setMfaEnabled] = useState(false);
  const [profileStatus, setProfileStatus] = useState("");

  // Modals for matching Flutter profile options
  const [isAboutOpen, setIsAboutOpen] = useState(false);
  const [isContactOpen, setIsContactOpen] = useState(false);
  const [supportSubject, setSupportSubject] = useState("");
  const [supportMessage, setSupportMessage] = useState("");
  const [supportSending, setSupportSending] = useState(false);
  const [supportStatus, setSupportStatus] = useState("");

  async function handleSendSupport(e: React.FormEvent) {
    e.preventDefault();
    setSupportSending(true);
    setSupportStatus("");
    try {
      // Register Zoho Support SMTP ticket document
      await addDoc(collection(db, "mail_triggers"), {
        to: settings.supportEmail,
        type: "SUPPORT_CONTACT",
        data: {
          name: profileName || user?.displayName || "Customer",
          email: user?.email || "",
          subject: supportSubject.trim(),
          message: supportMessage.trim(),
        },
        createdAt: serverTimestamp(),
      });

      // Write to support_tickets
      await addDoc(collection(db, "support_tickets"), {
        userId: user?.uid || "",
        name: profileName || user?.displayName || "Customer",
        email: user?.email || "",
        subject: supportSubject.trim(),
        message: supportMessage.trim(),
        status: "Open",
        replies: [],
        createdAt: serverTimestamp(),
      });

      setSupportStatus(`Support inquiry dispatched successfully to ${settings.supportEmail} via Zoho SMTP relay server!`);
      setSupportSubject("");
      setSupportMessage("");
      setTimeout(() => {
        setIsContactOpen(false);
        setSupportStatus("");
      }, 2500);
    } catch (err: any) {
      setSupportStatus(`SMTP relay failed: ${err.message || err}`);
    } finally {
      setSupportSending(false);
    }
  }

  // Redirect if not logged in
  useEffect(() => {
    if (!loading && !user) router.push("/login");
  }, [loading, router, user]);



  // Load products from Firestore (with automatic seeder fallback)
  useEffect(() => {
    if (!user) return;
    async function syncProducts() {
      try {
        const querySnapshot = await getDocs(collection(db, "products"));
        let fetchedProducts: Product[] = [];
        querySnapshot.forEach((docSnap) => {
          const docData = docSnap.data();
          const cleanImage = docData.imageUrl || docData.image || "";
          const priceNum = typeof docData.price === "number" ? docData.price : parseFloat(String(docData.price || "0").replace(/[^0-9.]/g, ""));
          const cleanPrice = isNaN(priceNum) ? "0.00" : priceNum.toFixed(2);
          fetchedProducts.push({
            id: docSnap.id,
            ...docData,
            image: cleanImage,
            price: cleanPrice,
          } as any);
        });

        // Seed products if collection is completely empty
        if (fetchedProducts.length === 0) {
          const batch = writeBatch(db);
          initialMockProducts.forEach((mockProd, idx) => {
            const newDocRef = doc(collection(db, "products"));
            const parsedPrice = parseFloat(mockProd.price.replace("$", ""));
            const priceVal = isNaN(parsedPrice) ? 0.0 : parsedPrice;
            const seededData = {
              name: mockProd.name,
              tag: mockProd.tag,
              price: priceVal,
              description: mockProd.description,
              image: mockProd.image,
              imageUrl: mockProd.image,
              category: mockProd.name.toLowerCase().includes("diaper") ? "Diapers" :
                        mockProd.name.toLowerCase().includes("puree") ? "Feeding" :
                        mockProd.name.toLowerCase().includes("onesie") ? "Clothing" : "Bath Care",
              stock: 20 + idx * 5,
            };
            batch.set(newDocRef, seededData);
            fetchedProducts.push({
              id: newDocRef.id,
              ...seededData,
              price: priceVal.toFixed(2)
            } as Product);
          });
          await batch.commit();
        }
        setProducts(fetchedProducts);
        setFilteredProducts(fetchedProducts);
      } catch (err) {
        console.error("Error loading products:", err);
      } finally {
        setProductsLoading(false);
      }
    }
    void syncProducts();
  }, [user]);

  // Load User Profile (Wishlist, Saved Address, MFA settings)
  useEffect(() => {
    if (!user?.uid) return;
    const unsub = onSnapshot(doc(db, "users", user.uid), (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        setUserProfile(data);
        setWishlistIds(data.wishlistedProductIds || []);
        setProfileName(data.displayName || user.displayName || "");
        setProfileAddress(data.savedAddress || "");
        setMfaEnabled(data.isMfaEnabled || data.isTotpEnabled || false);

        // Apply theme color
        if (data.themeColor) {
          document.documentElement.style.setProperty("--rose", data.themeColor);
          document.documentElement.style.setProperty("--rose-dark", data.themeColor === "#ff8fa1" ? "#e85f78" : data.themeColor);
        }
        // Apply dark mode
        if (data.darkMode !== undefined) {
          if (data.darkMode) {
            document.documentElement.classList.add("dark");
          } else {
            document.documentElement.classList.remove("dark");
          }
        }
      }
    });
    return () => unsub();
  }, [user]);

  // Load Orders from Firestore
  useEffect(() => {
    if (!user?.uid) return;
    const q = query(collection(db, "orders"), where("userId", "==", user.uid));
    const unsub = onSnapshot(q, (snapshot) => {
      const fetchedOrders: Order[] = [];
      snapshot.forEach((docSnap) => {
        const orderData = docSnap.data();
        fetchedOrders.push({
          id: docSnap.id,
          items: orderData.items || [],
          total: orderData.total || 0,
          address: orderData.address || "",
          status: orderData.status || "Pending",
          createdAt: orderData.createdAt,
        });
      });
      // Sort orders by date descending
      fetchedOrders.sort((a, b) => {
        const dateA = a.createdAt?.seconds || 0;
        const dateB = b.createdAt?.seconds || 0;
        return dateB - dateA;
      });
      setOrders(fetchedOrders);
    });
    return () => unsub();
  }, [user]);

  // Filter & Search Products
  useEffect(() => {
    let result = products;
    if (!settings.showOutOfStock) {
      result = result.filter((p) => p.stock > 0);
    }
    if (selectedCategory !== "All") {
      result = result.filter((p) => p.category === selectedCategory);
    }
    if (searchQuery.trim() !== "") {
      const queryLower = searchQuery.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(queryLower) ||
          p.description.toLowerCase().includes(queryLower) ||
          p.category.toLowerCase().includes(queryLower)
      );
    }
    setFilteredProducts(result);
  }, [selectedCategory, searchQuery, products, settings.showOutOfStock]);

  // Wishlist Handling
  async function toggleWishlist(productId: string) {
    if (!user?.uid) return;
    const currentWishlist = [...wishlistIds];
    const index = currentWishlist.indexOf(productId);
    if (index > -1) {
      currentWishlist.splice(index, 1);
    } else {
      currentWishlist.push(productId);
    }
    setWishlistIds(currentWishlist);
    await setDoc(doc(db, "users", user.uid), { wishlistedProductIds: currentWishlist }, { merge: true });
  }

  // Cart Operations
  function addToCart(product: Product) {
    const existing = cart.find((item) => item.product.id === product.id);
    if (existing) {
      setCart(
        cart.map((item) =>
          item.product.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        )
      );
    } else {
      setCart([...cart, { product, quantity: 1 }]);
    }
  }

  function updateCartQuantity(productId: string, delta: number) {
    setCart(
      cart
        .map((item) => {
          if (item.product.id === productId) {
            const nextQty = item.quantity + delta;
            return nextQty > 0 ? { ...item, quantity: nextQty } : null;
          }
          return item;
        })
        .filter(Boolean) as CartItem[]
    );
  }

  function removeFromCart(productId: string) {
    setCart(cart.filter((item) => item.product.id !== productId));
  }

  const cartTotal = cart.reduce((sum, item) => {
    const priceStr = String(item.product.price || "0");
    const priceNum = parseFloat(priceStr.replace("$", ""));
    return sum + (isNaN(priceNum) ? 0 : priceNum) * item.quantity;
  }, 0);

  // Submit Order Checkout
  async function handleCheckout(e: React.FormEvent) {
    e.preventDefault();
    if (!user?.uid || cart.length === 0) return;
    setIsCheckingOut(true);
    setCheckoutStatus("Placing order...");

    try {
      // 1. Write the order object to Firestore with status 'Paid' directly (since Stripe is removed)
      await addDoc(collection(db, "orders"), {
        userId: user.uid,
        email: user.email,
        items: cart.map((item) => ({
          id: item.product.id,
          name: item.product.name,
          price: item.product.price,
          quantity: item.quantity,
        })),
        total: parseFloat(cartTotal.toFixed(2)),
        address: shippingAddress.trim(),
        status: "Paid",
        createdAt: serverTimestamp(),
      });

      // 2. Clear cart and redirect
      setCart([]);
      setIsCheckoutOpen(false);
      alert("Order placed successfully! Thank you.");
      router.replace("/shop?tab=orders");
    } catch (err: any) {
      console.error(err);
      setCheckoutStatus("Failed to place order. Please try again.");
    } finally {
      setIsCheckingOut(false);
    }
  }

  // Update Profile info
  async function saveProfile(e: React.FormEvent) {
    e.preventDefault();
    if (!user?.uid) return;
    setProfileStatus("Saving...");
    try {
      await setDoc(
        doc(db, "users", user.uid),
        {
          displayName: profileName.trim(),
          savedAddress: profileAddress.trim(),
          isMfaEnabled: mfaEnabled,
        },
        { merge: true }
      );
      setProfileStatus("Profile updated successfully!");
    } catch {
      setProfileStatus("Error updating profile.");
    }
  }

  // AI Assistant simulated answers
  function handleSendMessage(e: React.FormEvent) {
    e.preventDefault();
    if (chatInput.trim() === "") return;
    const userMsg = chatInput.trim();
    setChatMessages((prev) => [...prev, { sender: "user", text: userMsg }]);
    setChatInput("");

    setTimeout(() => {
      const msgLower = userMsg.toLowerCase();
      let botResponse = "I appreciate your message! I'm scanning our knowledge base. For specific order issues, you can file a request in the Profile -> Support page.";

      if (msgLower.includes("diaper")) {
        botResponse = "Our CloudSoft Diapers are hypoallergenic, dermatologically certified, and feature breathability perfect for overnight protection. Standard options start at $18.99!";
      } else if (msgLower.includes("food") || msgLower.includes("puree") || msgLower.includes("feeding")) {
        botResponse = "We only sell 100% organic baby food purees with no synthetic fillers or added sugar. Pediatricians recommend our organic apple purees for infants 6 months and older.";
      } else if (msgLower.includes("delivery") || msgLower.includes("shipping")) {
        botResponse = "Standard delivery is completely free for all items! Orders usually arrive within 2-3 business days. You can track all packages in the 'Orders' tab.";
      } else if (msgLower.includes("return") || msgLower.includes("refund")) {
        botResponse = "We offer a 30-day hassle-free return policy on all unopened baby essentials. You can request a return directly through the contact/support forms.";
      } else if (msgLower.includes("mfa") || msgLower.includes("security")) {
        botResponse = "You can toggle Multi-Factor Authentication in the 'Profile' tab. This secures your checkout and triggers safety email warnings for unknown locations.";
      }
      setChatMessages((prev) => [...prev, { sender: "bot", text: botResponse }]);
    }, 800);
  }

  if (loading || !user) return <main className="loading-page">Loading BabyShopHub...</main>;

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Mobile Sidebar Backdrop */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-30 md:hidden" 
          onClick={() => setIsSidebarOpen(false)} 
        />
      )}

      {/* Navigation Sidebar */}
      <aside className={`fixed md:relative z-40 h-full w-64 bg-[var(--soft)] border-r border-border flex flex-col transition-transform transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'} shrink-0`}>
        <div className="p-4 flex items-center justify-between md:hidden">
          <span className="font-bold text-lg text-[var(--ink)] flex items-center gap-2"><Baby size={20} /> BabyShop</span>
          <button onClick={() => setIsSidebarOpen(false)} className="p-1 rounded hover:bg-muted text-[var(--ink)]">
            <X size={20} />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto px-4 py-6 flex flex-col gap-2">
          <nav className="flex flex-col gap-2">
            <button className={`flex items-center gap-3 px-3 py-2.5 rounded-xl font-bold transition-all ${activeTab === "home" ? "bg-[var(--ink)] text-[var(--soft)] dark:text-zinc-950" : "text-[var(--muted)] hover:bg-[var(--line)] hover:text-[var(--ink)]"}`} onClick={() => { setActiveTab("home"); setIsSidebarOpen(false); }}>
              <Home size={18} /> Home
            </button>
            <button className={`flex items-center gap-3 px-3 py-2.5 rounded-xl font-bold transition-all ${activeTab === "shop" ? "bg-[var(--ink)] text-[var(--soft)] dark:text-zinc-950" : "text-[var(--muted)] hover:bg-[var(--line)] hover:text-[var(--ink)]"}`} onClick={() => { setActiveTab("shop"); setIsSidebarOpen(false); }}>
              <ShoppingBag size={18} /> Shop Catalog
            </button>
            <button className={`flex items-center gap-3 px-3 py-2.5 rounded-xl font-bold transition-all ${activeTab === "wishlist" ? "bg-[var(--ink)] text-[var(--soft)] dark:text-zinc-950" : "text-[var(--muted)] hover:bg-[var(--line)] hover:text-[var(--ink)]"}`} onClick={() => { setActiveTab("wishlist"); setIsSidebarOpen(false); }}>
              <Heart size={18} /> Wishlist
            </button>
            <button className={`flex items-center gap-3 px-3 py-2.5 rounded-xl font-bold transition-all ${activeTab === "orders" ? "bg-[var(--ink)] text-[var(--soft)] dark:text-zinc-950" : "text-[var(--muted)] hover:bg-[var(--line)] hover:text-[var(--ink)]"}`} onClick={() => { setActiveTab("orders"); setIsSidebarOpen(false); }}>
              <Truck size={18} /> Track Orders
            </button>
            <button className={`flex items-center gap-3 px-3 py-2.5 rounded-xl font-bold transition-all ${activeTab === "assistant" ? "bg-[var(--ink)] text-[var(--soft)] dark:text-zinc-950" : "text-[var(--muted)] hover:bg-[var(--line)] hover:text(--[ink)]"}`} onClick={() => { setActiveTab("assistant"); setIsSidebarOpen(false); }}>
              <Bot size={18} /> AI Assistant
            </button>
            <button className={`flex items-center gap-3 px-3 py-2.5 rounded-xl font-bold transition-all ${activeTab === "profile" ? "bg-[var(--ink)] text-[var(--soft)] dark:text-zinc-950" : "text-[var(--muted)] hover:bg-[var(--line)] hover:text-[var(--ink)]"}`} onClick={() => { setActiveTab("profile"); setIsSidebarOpen(false); }}>
              <UserRound size={18} /> My Profile
            </button>
            {user?.role === "admin" && (
              <Link href="/admin" className="flex items-center gap-3 px-3 py-2.5 rounded-xl font-bold text-[var(--rose-dark)] hover:bg-rose-50 dark:hover:bg-rose-950/20 transition-all">
                <ShieldCheck size={18} /> Admin Panel
              </Link>
            )}
          </nav>
        </div>

        {/* Cart & Logout */}
        <div className="p-4 border-t border-border flex flex-col gap-3 shrink-0">
          <button onClick={() => { setIsCartOpen(true); setIsSidebarOpen(false); }} className="flex items-center justify-center gap-2 w-full py-3 bg-[var(--soft)] text-[var(--ink)] font-bold rounded-xl border border-border shadow-sm hover:bg-[var(--line)] transition-all">
            <ShoppingCart size={18} />
            Cart ({cart.reduce((s, i) => s + i.quantity, 0)})
          </button>
          <button className="flex items-center justify-center gap-2 w-full py-3 bg-transparent text-[var(--muted)] hover:text-[var(--rose-dark)] hover:bg-rose-50 font-bold rounded-xl transition-colors" onClick={async () => { await logout(); router.push("/login"); }}>
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Application Area */}
      <main className="flex-1 flex flex-col h-full overflow-hidden bg-[#fff] dark:bg-zinc-950">
        {/* HEADER/TOP BAR */}
        <header className="h-16 shrink-0 border-b border-border flex items-center justify-between px-4 md:px-8">
          <div className="flex items-center gap-3">
            <button className="md:hidden p-2 rounded-lg hover:bg-muted text-[var(--ink)]" onClick={() => setIsSidebarOpen(true)}>
              <Menu size={24} />
            </button>
            <span className="hidden md:flex font-bold text-lg text-[var(--ink)] items-center gap-2"><Baby size={20} /> BabyShop</span>
          </div>
          <div className="flex items-center gap-4">
            <div className="search-pill-v2">
              <Search size={17} />
              <input
                type="text"
                placeholder="Search catalog, clothing, feeding..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  if (activeTab !== "shop") setActiveTab("shop");
                }}
              />
            </div>
            <div className="w-8 h-8 rounded-full bg-[var(--rose-dark)] text-white flex items-center justify-center font-bold text-sm hidden md:flex">
              {user.displayName.slice(0, 1).toUpperCase()}
            </div>
          </div>
        </header>

        {/* TAB CONTENT SCROLL AREA */}
        <div className="flex-1 overflow-y-auto p-4 md:p-8">

          {/* HOME TAB */}
          {activeTab === "home" && (
            <div className="tab-view home-view animate-fade">
              {/* Premium Promo Slider Hero */}
              <div className="store-promo-hero">
                <div className="promo-text">
                  <span className="kicker-white">Seasonal Offer</span>
                  <h2>Organic Cotton Clothing Set</h2>
                  <p>Breathable fabric, completely non-toxic dyes, now 20% off in our shop catalog.</p>
                  <button onClick={() => setActiveTab("shop")} className="btn-light-rounded">
                    Shop Now <ArrowRight size={16} />
                  </button>
                </div>
                <div className="promo-bg-icon">🧸</div>
              </div>

              {/* Highlight statistics */}
              <div className="shop-dashboard-stats">
                <article>
                  <Package size={22} className="text-rose" />
                  <div>
                    <strong>{products.length} Products</strong>
                    <span>Premium Essentials Selections</span>
                  </div>
                </article>
                <article>
                  <Heart size={22} className="text-amber" />
                  <div>
                    <strong>{wishlistIds.length} Saved Items</strong>
                    <span>Your Bookmarked Wishlist</span>
                  </div>
                </article>
                <article>
                  <Truck size={22} className="text-mint" />
                  <div>
                    <strong>{orders.length} Placed Orders</strong>
                    <span>Track Status & Invoices</span>
                  </div>
                </article>
              </div>

              {/* Quick Info Grid */}
              <div className="home-parent-guides">
                <div>
                  <HeartHandshake size={28} />
                  <h3>Pediatric Certified Care</h3>
                  <p>Our catalog matches strict dermatological profiles. Protect babies from rash and irritation.</p>
                </div>
                <div>
                  <ShieldCheck size={28} />
                  <h3>Dynamic Safe Checkout</h3>
                  <p>Full secure payment validation, address book persistence, and real-time status alerts.</p>
                </div>
              </div>
            </div>
          )}

          {/* SHOP CATALOG TAB */}
          {activeTab === "shop" && (
            <div className="tab-view shop-view animate-fade">
              <div className="catalog-filters">
                <button className={selectedCategory === "All" ? "active" : ""} onClick={() => setSelectedCategory("All")}>All</button>
                <button className={selectedCategory === "Diapers" ? "active" : ""} onClick={() => setSelectedCategory("Diapers")}>Diapers</button>
                <button className={selectedCategory === "Feeding" ? "active" : ""} onClick={() => setSelectedCategory("Feeding")}>Feeding</button>
                <button className={selectedCategory === "Clothing" ? "active" : ""} onClick={() => setSelectedCategory("Clothing")}>Clothing</button>
                <button className={selectedCategory === "Bath Care" ? "active" : ""} onClick={() => setSelectedCategory("Bath Care")}>Bath Care</button>
              </div>

              {productsLoading ? (
                <div className="loading-spinner">Syncing Firebase Catalog...</div>
              ) : filteredProducts.length === 0 ? (
                <div className="empty-state">No products found matching your filter options.</div>
              ) : (
                <div className="product-grid-catalog">
                  {filteredProducts.map((product) => {
                    const isWishlisted = wishlistIds.includes(product.id);
                    return (
                      <article className="product-premium-card" key={product.id}>
                        <div className="card-image-wrapper">
                          <Image src={product.image && product.image.trim() !== "" ? product.image : "https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?auto=format&fit=crop&w=400&q=80"} alt={product.name} width={400} height={400} />
                          <button
                            onClick={() => toggleWishlist(product.id)}
                            className={`wishlist-toggle-btn ${isWishlisted ? "active" : ""}`}
                            aria-label="Toggle Wishlist"
                          >
                            <Heart size={18} fill={isWishlisted ? "var(--rose-dark)" : "none"} />
                          </button>
                        </div>
                        <div className="product-body">
                          <span className="product-tag-badge">{product.tag}</span>
                          <h3>{product.name}</h3>
                          <p>{product.description}</p>
                          {settings.enableReviews && (
                            <div className="flex items-center gap-1 my-1">
                              <span className="text-amber-500 font-bold text-sm">★</span>
                              <span className="text-xs text-[var(--muted)]">{(product as any).rating || 5.0}</span>
                            </div>
                          )}
                          <div className="product-card-footer">
                            <strong className="product-price">{settings.currencySymbol}{product.price}</strong>
                            <button className="add-to-cart-btn" onClick={() => addToCart(product)}>
                              Add to Cart
                            </button>
                          </div>
                        </div>
                      </article>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* WISHLIST TAB */}
          {activeTab === "wishlist" && (
            <div className="tab-view wishlist-view animate-fade">
              <h2>My Wishlisted Items ({wishlistIds.length})</h2>
              {wishlistIds.length === 0 ? (
                <div className="empty-state">
                  <p>Your wishlist is empty. Go browse the catalog and save your favorites!</p>
                  <button onClick={() => setActiveTab("shop")} className="btn-primary-gradient">Browse Catalog</button>
                </div>
              ) : (
                <div className="product-grid-catalog">
                  {products
                    .filter((p) => wishlistIds.includes(p.id))
                    .map((product) => (
                      <article className="product-premium-card" key={product.id}>
                        <div className="card-image-wrapper">
                          <Image src={product.image && product.image.trim() !== "" ? product.image : "https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?auto=format&fit=crop&w=400&q=80"} alt={product.name} width={400} height={400} />
                          <button
                            onClick={() => toggleWishlist(product.id)}
                            className="wishlist-toggle-btn active"
                          >
                            <Heart size={18} fill="var(--rose-dark)" />
                          </button>
                        </div>
                        <div className="product-body">
                          <span className="product-tag-badge">{product.tag}</span>
                          <h3>{product.name}</h3>
                          <p>{product.description}</p>
                          <div className="product-card-footer">
                            <strong className="product-price">{settings.currencySymbol}{product.price}</strong>
                            <button className="add-to-cart-btn" onClick={() => addToCart(product)}>
                              Add to Cart
                            </button>
                          </div>
                        </div>
                      </article>
                    ))}
                </div>
              )}
            </div>
          )}

          {/* ORDERS TRACKING TAB */}
          {activeTab === "orders" && (
            <div className="tab-view orders-view animate-fade">
              <h2>My Order History & Tracking</h2>
              {orders.length === 0 ? (
                <div className="empty-state">
                  <p>You have not placed any orders yet.</p>
                  <button onClick={() => setActiveTab("shop")} className="btn-primary-gradient">Order Now</button>
                </div>
              ) : (
                <div className="orders-log-list">
                  {orders.map((order) => (
                    <article key={order.id} className="order-log-card">
                      <div className="order-header">
                        <div>
                          <strong>Invoice ID: #{order.id}</strong>
                          <span className="order-date">
                            {order.createdAt?.seconds
                              ? new Date(order.createdAt.seconds * 1000).toLocaleDateString()
                              : "Processing..."}
                          </span>
                        </div>
                        <span className={`status-pill ${order.status.toLowerCase()}`}>
                          {order.status}
                        </span>
                      </div>
                      <div className="order-items-summary">
                        {order.items.map((item, idx) => (
                          <div className="order-item-row" key={idx}>
                            <span>{item.name} (x{item.quantity})</span>
                            <strong>{item.price}</strong>
                          </div>
                        ))}
                      </div>
                      <div className="order-footer">
                        <div>
                          <span>Delivery Address:</span>
                          <p>{order.address}</p>
                        </div>
                        <div className="order-total-sum">
                          <span>Total Paid:</span>
                          <strong>{settings.currencySymbol}{order.total.toFixed(2)}</strong>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* AI ASSISTANT CHAT TAB */}
          {activeTab === "assistant" && (
            <div className="tab-view assistant-view animate-fade">
              <h2>Grounded Parent Help Assistant</h2>
              <p className="assistant-desc">Ask questions about organic labels, secure MFA toggles, diaper listings, and checkout guides.</p>
              <div className="ai-chat-window-dashboard">
                <div className="chat-messages-box">
                  {chatMessages.map((msg, idx) => (
                    <div key={idx} className={`chat-bubble-row ${msg.sender === "bot" ? "bot" : "user"}`}>
                      <div className="chat-bubble">
                        <p>{msg.text}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <form className="chat-input-form" onSubmit={handleSendMessage}>
                  <input
                    type="text"
                    placeholder="Type questions (e.g. Do you sell organic food? How does shipping work?)..."
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                  />
                  <button type="submit">Ask Assistant</button>
                </form>
              </div>
            </div>
          )}

          {/* PROFILE MANAGEMENT TAB */}
          {activeTab === "profile" && (
            <div className="tab-view profile-view animate-fade">
              <h2>My Customer Settings</h2>
              <form className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mt-6 items-start w-full" onSubmit={saveProfile}>
                {/* Left Column: Profile form edits */}
                <div className="flex flex-col gap-5 p-6 bg-[var(--soft)] border border-border rounded-2xl">
                  <h3 className="text-lg font-bold text-[var(--ink)] mb-2">Edit Account Details</h3>
                  <label className="flex flex-col gap-2 font-bold text-sm text-[var(--ink)]">
                    <span>Full Display Name</span>
                    <input
                      type="text"
                      required
                      className="p-3 border border-border rounded-xl bg-white dark:bg-zinc-900 text-[var(--ink)]"
                      value={profileName}
                      onChange={(e) => setProfileName(e.target.value)}
                    />
                  </label>
                  <label className="flex flex-col gap-2 font-bold text-sm text-[var(--ink)]">
                    <span>Primary Shipping Address</span>
                    <textarea
                      rows={3}
                      required
                      placeholder="Enter default shipping street address, postal code, and country"
                      className="p-3 border border-border rounded-xl bg-white dark:bg-zinc-900 text-[var(--ink)]"
                      value={profileAddress}
                      onChange={(e) => setProfileAddress(e.target.value)}
                    />
                  </label>
                  <div className="mfa-security-box flex justify-between items-center p-4 border border-border rounded-xl bg-white dark:bg-zinc-900 mt-2">
                    <div className="mfa-text pr-4">
                      <h4 className="font-bold text-[var(--ink)] my-0">Multi-Factor Authentication (MFA)</h4>
                      <p className="text-xs text-[var(--muted)] m-0 mt-1">Secures your checkout. Dispatches verification code on logins.</p>
                    </div>
                    <label className="toggle-switch relative inline-block w-12 h-6 shrink-0">
                      <input
                        type="checkbox"
                        checked={mfaEnabled}
                        onChange={(e) => setMfaEnabled(e.target.checked)}
                      />
                      <span className="toggle-slider"></span>
                    </label>
                  </div>
                  <div className="flex flex-col gap-3 mt-4">
                    {profileStatus && <strong className="profile-status-alert text-center text-emerald-600">{profileStatus}</strong>}
                    <button type="submit" className="btn-primary-gradient w-full py-3 text-white font-bold rounded-xl border-none shadow-md">
                      Save Account Changes
                    </button>
                    <Link href="/profile/theme" className="btn-secondary-outline text-center block w-full justify-center">
                      App Theme Customizer
                    </Link>
                  </div>
                </div>

                {/* Right Column: Mobile settings-list style items */}
                <div className="profile-settings-list flex flex-col gap-3">
                  <h3 className="text-sm font-bold text-[var(--muted)] uppercase tracking-wider mb-2">More Profile Actions</h3>
                  
                  <button 
                    type="button"
                    onClick={() => { setActiveTab("orders"); }}
                    className="flex items-center justify-between p-4 bg-[var(--soft)] hover:bg-[var(--line)] border border-border rounded-xl transition-all text-left w-full"
                  >
                    <div>
                      <strong className="block text-[var(--ink)]">My Orders</strong>
                      <span className="text-xs text-[var(--muted)]">Track status and review your order history</span>
                    </div>
                    <span className="text-[var(--muted)] font-bold">→</span>
                  </button>

                  <button 
                    type="button"
                    onClick={() => { setActiveTab("wishlist"); }}
                    className="flex items-center justify-between p-4 bg-[var(--soft)] hover:bg-[var(--line)] border border-border rounded-xl transition-all text-left w-full"
                  >
                    <div>
                      <strong className="block text-[var(--ink)]">My Wishlist</strong>
                      <span className="text-xs text-[var(--muted)]">View products you saved and check availability</span>
                    </div>
                    <span className="text-[var(--muted)] font-bold">→</span>
                  </button>

                  <button 
                    type="button"
                    onClick={() => {
                      const el = document.querySelector('textarea[placeholder*="Enter default shipping"]');
                      if (el) (el as HTMLElement).focus();
                    }}
                    className="flex items-center justify-between p-4 bg-[var(--soft)] hover:bg-[var(--line)] border border-border rounded-xl transition-all text-left w-full"
                  >
                    <div>
                      <strong className="block text-[var(--ink)]">Saved Addresses</strong>
                      <span className="text-xs text-[var(--muted)]">Manage default shipping and delivery options</span>
                    </div>
                    <span className="text-[var(--muted)] font-bold">→</span>
                  </button>

                  <button 
                    type="button"
                    onClick={() => setIsAboutOpen(true)}
                    className="flex items-center justify-between p-4 bg-[var(--soft)] hover:bg-[var(--line)] border border-border rounded-xl transition-all text-left w-full"
                  >
                    <div>
                      <strong className="block text-[var(--ink)]">About Us</strong>
                      <span className="text-xs text-[var(--muted)]">Read about BabyShopHub and our clinical safety standards</span>
                    </div>
                    <span className="text-[var(--muted)] font-bold">→</span>
                  </button>

                  <button 
                    type="button"
                    onClick={() => setIsContactOpen(true)}
                    className="flex items-center justify-between p-4 bg-[var(--soft)] hover:bg-[var(--line)] border border-border rounded-xl transition-all text-left w-full"
                  >
                    <div>
                      <strong className="block text-[var(--ink)]">Contact Customer Support</strong>
                      <span className="text-xs text-[var(--muted)]">Get in touch with support via Zoho SMTP inquiry</span>
                    </div>
                    <span className="text-[var(--muted)] font-bold">→</span>
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      </main>
      {/* SHOPPING CART DRAWER (SLIDE OUT) */}
      {isCartOpen && (
        <div className="cart-drawer-overlay">
          <div className="cart-drawer animate-slide-left">
            <div className="cart-header">
              <h2>My Shopping Cart</h2>
              <button className="close-cart-btn" onClick={() => setIsCartOpen(false)}>
                <X size={20} />
              </button>
            </div>

            {cart.length === 0 ? (
              <div className="cart-empty-body">
                <ShoppingCart size={48} className="text-muted" />
                <p>Your shopping cart is currently empty.</p>
                <button className="btn-primary-gradient" onClick={() => { setIsCartOpen(false); setActiveTab("shop"); }}>
                  Shop Baby Essentials
                </button>
              </div>
            ) : (
              <>
                <div className="cart-items-list">
                  {cart.map((item) => (
                    <div className="cart-item-card" key={item.product.id}>
                      <Image src={item.product.image && item.product.image.trim() !== "" ? item.product.image : "https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?auto=format&fit=crop&w=80&q=80"} alt={item.product.name} width={80} height={80} />
                      <div className="cart-item-info">
                        <h3>{item.product.name}</h3>
                        <strong className="cart-item-price">{item.product.price}</strong>
                        <div className="quantity-controls">
                          <button onClick={() => updateCartQuantity(item.product.id, -1)}><Minus size={14} /></button>
                          <span>{item.quantity}</span>
                          <button onClick={() => updateCartQuantity(item.product.id, 1)}><Plus size={14} /></button>
                        </div>
                      </div>
                      <button className="remove-item-btn" onClick={() => removeFromCart(item.product.id)}>
                        <Trash2 size={16} />
                      </button>
                    </div>
                  ))}
                </div>

                <div className="cart-summary-footer">
                  <div className="summary-row">
                    <span>Subtotal:</span>
                    <strong>{settings.currencySymbol}{cartTotal.toFixed(2)}</strong>
                  </div>
                  {settings.enableFreeShipping && (
                    <div className="summary-row">
                      <span>Shipping:</span>
                      <strong className="text-green">FREE</strong>
                    </div>
                  )}
                  <button
                    className="checkout-btn"
                    onClick={() => {
                      setShippingAddress(profileAddress);
                      setIsCheckoutOpen(true);
                    }}
                  >
                    Proceed to Checkout
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* CHECKOUT MODAL WINDOW */}
      {isCheckoutOpen && (
        <div className="modal-overlay">
          <div className="modal-card checkout-modal-card animate-scale-up">
            <div className="modal-header">
              <h2>Secure Order Checkout</h2>
              <button className="close-btn" onClick={() => setIsCheckoutOpen(false)}>×</button>
            </div>
            <form onSubmit={handleCheckout} className="checkout-form">
              <label style={{ gridColumn: "span 2" }}>
                <span>Delivery Shipping Address</span>
                <input
                  type="text"
                  required
                  placeholder="Street Address, City, Postal Code"
                  value={shippingAddress}
                  onChange={(e) => setShippingAddress(e.target.value)}
                />
              </label>

              <div className="checkout-totals" style={{ gridColumn: "span 2" }}>
                <div><span>Total Items:</span><strong>{cart.reduce((s, i) => s + i.quantity, 0)}</strong></div>
                <div><span>Total Price:</span><strong>{settings.currencySymbol}{cartTotal.toFixed(2)}</strong></div>
              </div>

              {checkoutStatus && <strong className="checkout-error-text" style={{ gridColumn: "span 2" }}>{checkoutStatus}</strong>}
              <div className="checkout-actions" style={{ gridColumn: "span 2" }}>
                <button type="button" className="btn-cancel-btn" onClick={() => setIsCheckoutOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn-submit-btn" disabled={isCheckingOut}>
                  {isCheckingOut ? "Processing..." : `Place Order (${settings.currencySymbol}${cartTotal.toFixed(2)})`}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ABOUT US MODAL */}
      {isAboutOpen && (
        <div className="modal-overlay">
          <div className="modal-card animate-scale-up p-6 relative">
            <div className="modal-header">
              <h2>About BabyShopHub</h2>
              <button className="close-btn" onClick={() => setIsAboutOpen(false)}>×</button>
            </div>
            <div className="p-4 space-y-4 text-[var(--ink)]">
              <p>Welcome to <strong>BabyShopHub</strong>, your trusted destination for clinical-grade baby essentials and parent support.</p>
              <p>Our products match strict pediatric dermatological standards. Every clothing item is made with organic cotton and non-toxic dyes, and our feeding essentials are 100% organic and free of synthetic fillers or added sugar.</p>
              <p>We are dedicated to helping parents navigate the early years with premium, clean products and AI-powered recommendations.</p>
              <div className="mt-6 flex justify-end">
                <button className="btn-primary-gradient px-4 py-2 text-white rounded-xl border-none" onClick={() => setIsAboutOpen(false)}>
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* CONTACT SUPPORT MODAL */}
      {isContactOpen && (
        <div className="modal-overlay">
          <div className="modal-card animate-scale-up p-6">
            <div className="modal-header">
              <h2>Contact Customer Support</h2>
              <button className="close-btn" onClick={() => setIsContactOpen(false)}>×</button>
            </div>
            <form onSubmit={handleSendSupport} className="checkout-form p-4">
              <p className="text-sm text-[var(--muted)] mb-4">Send a support inquiry to our team. Message will be routed through our Zoho SMTP relay server.</p>
              <label className="flex flex-col gap-2 mb-4">
                <span>Subject</span>
                <input
                  type="text"
                  required
                  placeholder="Subject of inquiry"
                  className="p-3 border border-border rounded-xl bg-[var(--soft)] text-[var(--ink)]"
                  value={supportSubject}
                  onChange={(e) => setSupportSubject(e.target.value)}
                />
              </label>
              <label className="flex flex-col gap-2 mb-4">
                <span>Message Details</span>
                <textarea
                  rows={4}
                  required
                  placeholder="Explain your problem or questions in detail..."
                  className="p-3 border border-border rounded-xl bg-[var(--soft)] text-[var(--ink)]"
                  value={supportMessage}
                  onChange={(e) => setSupportMessage(e.target.value)}
                />
              </label>

              {supportStatus && <strong className="profile-status-alert text-emerald-600 block my-2">{supportStatus}</strong>}

              <div className="checkout-actions mt-4 flex gap-3">
                <button type="button" className="btn-cancel-btn flex-1" onClick={() => setIsContactOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn-submit-btn flex-1" disabled={supportSending}>
                  {supportSending ? "Sending via SMTP..." : "Send Inquiry"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default function ShopPage() {
  return (
    <Suspense fallback={<div className="flex justify-center items-center h-screen bg-[var(--soft)] text-[var(--ink)]">Loading Shop...</div>}>
      <ShopPageContent />
    </Suspense>
  );
}

