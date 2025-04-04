Using **Axios** with **Expo** is straightforward, but there are a few key configurations needed for optimal performance in React Native. Here's a complete guide:

---

### **1. Install Axios**

```bash
expo install axios
# or
npm install axios
```

---

### **2. Basic API Client Setup**

Create an axios instance (`lib/apiClient.ts`):

```typescript
import axios from 'axios';
import * as SecureStore from 'expo-secure-store';

const apiClient = axios.create({
    baseURL: 'https://your-api.com/api/v1', // Replace with your API URL
    timeout: 10000, // 10 seconds
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor for adding auth token
apiClient.interceptors.request.use(
    async (config) => {
        const token = await SecureStore.getItemAsync('auth_token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Response interceptor for error handling
apiClient.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            // Handle token expiration
        }
        return Promise.reject(error);
    }
);

export default apiClient;
```

---

### **3. Make API Requests**

#### **GET Request Example**

```typescript
import apiClient from '../lib/apiClient';

const fetchPosts = async () => {
    try {
        const response = await apiClient.get('/posts');
        return response.data;
    } catch (error) {
        console.error('GET Error:', error);
        throw error;
    }
};
```

#### **POST Request Example**

```typescript
const createPost = async (postData) => {
    try {
        const response = await apiClient.post('/posts', postData);
        return response.data;
    } catch (error) {
        console.error('POST Error:', error);
        throw error;
    }
};
```

---

### **4. Expo-Specific Configurations**

#### **A. Handling Network Errors**

```typescript
import { Platform } from 'react-native';
import * as Network from 'expo-network';

const checkNetwork = async () => {
    const networkState = await Network.getNetworkStateAsync();
    if (!networkState.isConnected) {
        throw new Error('No internet connection');
    }
};

// Use before API calls:
await checkNetwork();
```

#### **B. Secure Storage for Tokens**

```bash
expo install expo-secure-store
```

```typescript
import * as SecureStore from 'expo-secure-store';

// Store token after login
await SecureStore.setItemAsync('auth_token', 'your-jwt-token');

// Retrieve token
const token = await SecureStore.getItemAsync('auth_token');
```

---

### **5. Advanced Configuration**

#### **A. File Uploads**

```typescript
const uploadImage = async (uri) => {
    const formData = new FormData();
    formData.append('file', {
        uri,
        name: 'image.jpg',
        type: 'image/jpeg',
    });

    const response = await apiClient.post('/upload', formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
    return response.data;
};
```

#### **B. Cancellation**

```typescript
const source = axios.CancelToken.source();

try {
    const response = await apiClient.get('/posts', {
        cancelToken: source.token,
    });
} catch (error) {
    if (axios.isCancel(error)) {
        console.log('Request canceled');
    }
}

// Cancel the request
source.cancel('Operation canceled by the user.');
```

---

### **6. Error Handling Patterns**

Create a standardized error handler:

```typescript
interface APIError {
    message: string;
    status?: number;
    data?: any;
}

const handleApiError = (error: any): APIError => {
    if (axios.isAxiosError(error)) {
        return {
            message: error.response?.data?.message || error.message,
            status: error.response?.status,
            data: error.response?.data,
        };
    }
    return { message: 'An unknown error occurred' };
};

// Usage:
try {
    await apiClient.get('/posts');
} catch (error) {
    const apiError = handleApiError(error);
    Alert.alert('Error', apiError.message);
}
```

---

### **7. React Query Integration (Recommended)**

For better data management:

```bash
expo install @tanstack/react-query
```

```typescript
import { useQuery } from '@tanstack/react-query';

const usePosts = () => {
    return useQuery({
        queryKey: ['posts'],
        queryFn: () => apiClient.get('/posts').then((res) => res.data),
        staleTime: 1000 * 60 * 5, // 5 minutes cache
    });
};

// In component:
const { data, isLoading, error } = usePosts();
```

---

### **Key Considerations for Expo**

1. **Android Cleartext Traffic**: Add to `android/app/src/main/AndroidManifest.xml`:

    ```xml
    <application
      android:usesCleartextTraffic="true"
      ...>
    ```

2. **iOS ATS Exception** (for HTTP URLs): Add to `app.json`:

    ```json
    "ios": {
      "infoPlist": {
        "NSAppTransportSecurity": {
          "NSAllowsArbitraryLoads": true
        }
      }
    }
    ```

3. **Debugging**: Use `axios-debug-log` in development:
    ```bash
    npm install axios-debug-log
    ```

---

### **Complete Example Component**

```tsx
import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import apiClient from '../lib/apiClient';

const PostsScreen = () => {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await apiClient.get('/posts');
                setPosts(response.data);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading) return <ActivityIndicator size="large" />;

    return (
        <View>
            {posts.map((post) => (
                <Text key={post.id}>{post.title}</Text>
            ))}
        </View>
    );
};

export default PostsScreen;
```

---

### **Alternatives for Expo**

1. **Built-in Fetch API**: Works out of the box with Expo
2. **React Query's Fetch**: Built-in with `@tanstack/react-query`
3. **Apollo Client**: For GraphQL APIs

Would you like me to show how to implement any of these specific scenarios in more detail?
