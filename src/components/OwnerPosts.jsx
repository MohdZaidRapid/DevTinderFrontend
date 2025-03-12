import { useEffect, useState } from "react";
import axios from "axios";
import { BASE_URL } from "../utils/constants";

const OwnerPosts = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [prices, setPrices] = useState({}); // State to store price inputs

  useEffect(() => {
    const fetchOwnerPosts = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/posts/mine`, {
          withCredentials: true,
        });
        setPosts(response.data.data);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch posts");
      } finally {
        setLoading(false);
      }
    };

    fetchOwnerPosts();
  }, []);

  // Function to handle selling and marking as sold
  const updatePostSaleStatus = async (postId, price = null) => {
    try {
      const requestData =
        price !== null ? { price: Number(price) } : { price: 0 };

      const response = await axios.put(
        `${BASE_URL}/posts/${postId}/sell`,
        requestData,
        { withCredentials: true }
      );

      setPosts((prevPosts) =>
        prevPosts.map((post) =>
          post._id === postId
            ? { ...post, isForSale: price > 0, price: Number(price) }
            : post
        )
      );

      alert(response.data.message);
    } catch (err) {
      alert(err.response?.data?.message || "Failed to update post");
    }
  };

  // Handle input change for price
  const handlePriceChange = (postId, value) => {
    setPrices((prev) => ({
      ...prev,
      [postId]: value, // Keep value as string, convert later
    }));
  };

  if (loading)
    return <p className="text-center text-gray-500 mt-4">Loading...</p>;
  if (error) return <p className="text-red-500 text-center mt-4">{error}</p>;

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow-lg rounded-lg mt-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">My Posts</h2>
      {posts.length === 0 ? (
        <p className="text-gray-600 text-center">No posts found</p>
      ) : (
        <ul className="space-y-4">
          {posts.map((post) => (
            <li
              key={post._id}
              className="p-4 border rounded-lg shadow-md bg-gray-50 hover:bg-gray-100 transition"
            >
              <h3 className="text-lg font-semibold text-gray-800">
                {post.title}
              </h3>
              <p className="text-gray-600">
                Price:{" "}
                <span className="font-medium">${post.price || "N/A"}</span>
              </p>
              <p
                className={`text-sm font-medium ${
                  post.isForSale ? "text-green-600" : "text-red-500"
                }`}
              >
                {post.isForSale ? "For Sale" : "Sold"}
              </p>

              {/* Input field for price */}
              {!post.isForSale && (
                <div className="mt-3 flex gap-2">
                  <input
                    type="number"
                    value={prices[post._id] || ""}
                    onChange={(e) =>
                      handlePriceChange(post._id, e.target.value)
                    }
                    className="border p-2 rounded-md w-24"
                    placeholder="Set Price"
                  />
                  <button
                    onClick={() => {
                      const priceValue = prices[post._id]
                        ? Number(prices[post._id])
                        : null; // Ensure a valid number
                      console.log(
                        "Passing Price to updatePostSaleStatus:",
                        priceValue
                      );
                      updatePostSaleStatus(post._id, priceValue);
                    }}
                    className="bg-blue-500 text-white py-1 px-3 rounded-md hover:bg-blue-600 transition"
                  >
                    Put for Sale
                  </button>
                </div>
              )}

              {/* Mark as Sold Button */}
              {post.isForSale && (
                <button
                  onClick={() => updatePostSaleStatus(post._id, 0)} // Pass price as 0
                  className="mt-2 bg-red-500 text-white py-1 px-3 rounded-md hover:bg-red-600 transition"
                >
                  Mark as Sold
                </button>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default OwnerPosts;
