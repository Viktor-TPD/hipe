const API_BASE_URL =
  process.env.NODE_ENV === "production"
    ? "/api/v1"
    : "http://localhost:4000/api/v1";

async function fetchApi(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`;

  const defaultOptions = {
    headers: {
      "Content-Type": "application/json",
    },
  };

  const fetchOptions = { ...defaultOptions, ...options };

  try {
    const response = await fetch(url, fetchOptions);

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "An error occurred");
    }

    return data;
  } catch (error) {
    console.error(`API Error (${endpoint}):`, error);
    throw error;
  }
}

export const authApi = {
  register: (userData) =>
    fetchApi("/auth/register", {
      method: "POST",
      body: JSON.stringify(userData),
    }),

  login: (credentials) =>
    fetchApi("/auth/login", {
      method: "POST",
      body: JSON.stringify(credentials),
    }),

  logout: () =>
    fetchApi("/auth/logout", {
      method: "POST",
    }),

  verifySession: (userId) =>
    fetchApi("/auth/verify", {
      method: "POST",
      body: JSON.stringify({ userId }),
    }),
};

export const studentApi = {
  getAll: (filters = {}) => {
    const queryParams = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (Array.isArray(value)) {
        value.forEach((v) => queryParams.append(key, v));
      } else if (value !== undefined && value !== null) {
        queryParams.append(key, value);
      }
    });

    const queryString = queryParams.toString();
    return fetchApi(`/students${queryString ? `?${queryString}` : ""}`);
  },

  getById: (userId) => fetchApi(`/students/${userId}`),

  create: (profileData) =>
    fetchApi("/students", {
      method: "POST",
      body: JSON.stringify(profileData),
    }),

  update: (userId, profileData) =>
    fetchApi(`/students/${userId}`, {
      method: "PUT",
      body: JSON.stringify(profileData),
    }),

  delete: (userId) =>
    fetchApi(`/students/${userId}`, {
      method: "DELETE",
    }),
};

export const companyApi = {
  getAll: () => fetchApi("/companies"),

  getById: (userId) => fetchApi(`/companies/${userId}`),

  create: (profileData) =>
    fetchApi("/companies", {
      method: "POST",
      body: JSON.stringify(profileData),
    }),

  update: (userId, profileData) =>
    fetchApi(`/companies/${userId}`, {
      method: "PUT",
      body: JSON.stringify(profileData),
    }),

  delete: (userId) =>
    fetchApi(`/companies/${userId}`, {
      method: "DELETE",
    }),
};

export const userApi = {
  getProfile: (userId) => fetchApi(`/users/${userId}/profile`),
};

export const likesApi = {
  create: (likeData) =>
    fetchApi("/likes", {
      method: "POST",
      body: JSON.stringify(likeData),
    }),

  update: (likeId, updateData) =>
    fetchApi(`/likes/${likeId}`, {
      method: "PUT",
      body: JSON.stringify(updateData),
    }),

  delete: (likeId) =>
    fetchApi(`/likes/${likeId}`, {
      method: "DELETE",
    }),
};

export const uploadApi = {
  uploadProfileImage: (userId, formData) => {
    const uploadUrl = `${API_BASE_URL}/uploads/profile-image/${userId}`;

    return fetch(uploadUrl, {
      method: "POST",
      body: formData,
    }).then((response) => {
      if (!response.ok) {
        return response.json().then((err) => {
          throw new Error(err.message);
        });
      }
      return response.json();
    });
  },
};

export default {
  auth: authApi,
  students: studentApi,
  companies: companyApi,
  users: userApi,
  likes: likesApi,
  uploads: uploadApi,
};
