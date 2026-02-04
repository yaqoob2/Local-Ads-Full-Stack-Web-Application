import React, { useState, useEffect } from 'react';
import AdCard from '../../components/home/AdCard';
import FiltersBar from '../../components/home/FiltersBar';
import CategoryChips from '../../components/home/CategoryChips';
import SponsoredSpotlight from '../../components/home/SponsoredSpotlight';
import FeaturedRow from '../../components/home/FeaturedRow';
import { getAds } from '../../api/ads.api';
import { getCategories } from '../../api/meta.api';
import { splitByPlan, pickBalancedAds } from '../../utils/sponsoredPicker';
import Pagination from '../../components/common/Pagination';
import SkeletonCard from '../../components/common/SkeletonCard';
import { motion } from 'framer-motion';

const Home = () => {
    const [ads, setAds] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [spotlightAds, setSpotlightAds] = useState([]);
    const [featuredAds, setFeaturedAds] = useState([]);
    const [filteredAds, setFilteredAds] = useState([]);
    const [filters, setFilters] = useState({
        category: '',
        city: '',
        pincode: '',
        search: ''
    });
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(25); // User requested 25

    // Animation Variants
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.1 }
        }
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1
        }
    };

    // Fetch All Data on Load
    useEffect(() => {
        const fetchAllData = async () => {
            try {
                setLoading(true);
                const [cats, data] = await Promise.all([
                    getCategories(),
                    getAds() // Returns the full list of approved ads
                ]);

                // Handle different return structures if API changed, assuming returns array
                const allAds = Array.isArray(data) ? data : (data.ads || []);

                setCategories(cats);
                setAds(allAds);
                setFilteredAds(allAds);

                // Sponsored & Featured Logic
                const { growthAds, businessAds } = splitByPlan(allAds);

                // 1. Sponsored Spotlight: Top 6 (Balanced)
                const spotlight = pickBalancedAds(growthAds, businessAds, 6);
                setSpotlightAds(spotlight);

                // 2. Featured Row: Next 8 (Balanced, exclude spotlight ones)
                const spotlightIds = new Set(spotlight.map(a => a._id));
                const remainingGrowth = growthAds.filter(a => !spotlightIds.has(a._id));
                const remainingBusiness = businessAds.filter(a => !spotlightIds.has(a._id));

                const featured = pickBalancedAds(remainingGrowth, remainingBusiness, 8);
                setFeaturedAds(featured);

            } catch (err) {
                console.error("Failed to load home data", err);
                setError("Could not load ads. Please try again.");
            } finally {
                setLoading(false);
            }
        };

        fetchAllData();
    }, []);

    // Client-side Filtering
    useEffect(() => {
        let result = [...ads];

        if (filters.category) {
            result = result.filter(ad => {
                const catName = typeof ad.category === 'object' ? ad.category.name : ad.category;
                return catName === filters.category;
            });
        }

        if (filters.city) {
            result = result.filter(ad => ad.location?.city?.toLowerCase() === filters.city.toLowerCase());
        }

        if (filters.pincode) {
            result = result.filter(ad => ad.location?.pincode?.includes(filters.pincode));
        }

        if (filters.search) {
            const q = filters.search.toLowerCase();
            result = result.filter(ad =>
                ad.headline?.toLowerCase().includes(q) ||
                ad.content?.title?.toLowerCase().includes(q) ||
                ad.description?.toLowerCase().includes(q) ||
                (typeof ad.category === 'object' ? ad.category.name : ad.category)?.toLowerCase().includes(q)
            );
        }

        setFilteredAds(result);
        setCurrentPage(1); // Reset to page 1 on filter change
    }, [filters, ads]);

    const handleFilterChange = (key, value) => {
        setFilters(prev => ({ ...prev, [key]: value }));
    };

    const handleLocationClick = () => {
        if (!navigator.geolocation) {
            alert("Geolocation is not supported by your browser");
            return;
        }

        setLoading(true);
        navigator.geolocation.getCurrentPosition(async (position) => {
            try {
                const { latitude, longitude } = position.coords;
                // Free Reverse Geocoding API (BigDataCloud) - No Key Required
                const response = await fetch(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`);
                const data = await response.json();

                // Extract City (locality or city)
                const city = data.locality || data.city || "";

                if (city) {
                    setFilters(prev => ({ ...prev, city: city.toLowerCase() }));
                    alert(`Location detected: ${city}`);
                } else {
                    alert("Could not detect city from location.");
                }
            } catch (error) {
                console.error("Reverse geocoding failed", error);
                alert("Failed to get city name.");
            } finally {
                setLoading(false);
            }
        }, (error) => {
            console.error("Geolocation error", error);
            alert("Unable to retrieve your location. Please allow location access.");
            setLoading(false);
        });
    };

    // Pagination Logic
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredAds.slice(indexOfFirstItem, indexOfLastItem);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    if (loading) {
        return (
            <div className="max-w-7xl mx-auto px-4 py-8">
                {/* Skeleton for Filters */}
                <div className="h-24 bg-gray-100 rounded-lg mb-6 animate-pulse"></div>

                {/* Skeleton for Spotlight */}
                <div className="h-[220px] bg-gray-100 rounded-2xl mb-8 animate-pulse"></div>

                {/* Skeleton for Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-8">
                    {[...Array(8)].map((_, i) => (
                        <SkeletonCard key={i} />
                    ))}
                </div>
            </div>
        );
    }

    if (error) {
        return <div className="text-center text-red-500 mt-10">{error}</div>;
    }

    return (
        <div className="max-w-7xl mx-auto px-4 py-8">
            <FiltersBar
                categories={categories}
                filters={filters}
                onFilterChange={handleFilterChange}
                onUseLocation={handleLocationClick}
            />

            <CategoryChips
                categories={[...categories].sort((a, b) => a.name.localeCompare(b.name))}
                selectedCategory={filters.category}
                onSelectCategory={(cat) => handleFilterChange('category', cat)}
            />

            {/* SPONSORED SPOTLIGHT (Only if no active filters) */}
            {!filters.search && !filters.category && !filters.city && !filters.pincode && (
                <>
                    <SponsoredSpotlight ads={spotlightAds} />
                    <FeaturedRow ads={featuredAds} />
                </>
            )}

            <div className="mb-6 mt-8">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Latest Recommendations</h2>
                {currentItems.length === 0 ? (
                    <div className="text-center py-20 text-gray-500 bg-gray-50 rounded-xl border border-dashed border-gray-300">
                        <p className="text-lg">No ads found matching your criteria.</p>
                        <button onClick={() => setFilters({ category: '', city: '', pincode: '', search: '' })} className="mt-4 text-blue-600 hover:underline">
                            Clear Filters
                        </button>
                    </div>
                ) : (
                    <>
                        <motion.div
                            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                            variants={containerVariants}
                            initial="hidden"
                            animate="visible"
                        >
                            {currentItems.map((ad) => (
                                <motion.div key={ad._id} variants={itemVariants}>
                                    <AdCard ad={ad} />
                                </motion.div>
                            ))}
                        </motion.div>

                        <Pagination
                            itemsPerPage={itemsPerPage}
                            totalItems={filteredAds.length}
                            paginate={paginate}
                            currentPage={currentPage}
                        />
                    </>
                )}
            </div>
        </div>
    );
};

export default Home;
