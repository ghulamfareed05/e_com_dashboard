import axios from "axios";

export class HttpClient {
  // static baseUrl:String = "http://localhost:3000";
  static baseUrl:String = "https://e-com-backend-1zsb.onrender.com";

  static async post(url: string, data: any) {
    try {
        console.log(this.baseUrl+url);
      const response = await axios.post(this.baseUrl+url, data, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response?.status === 200) {
        return { data: response.data };
      } else {
        return { error: response?.data?.error };
      }
    } catch (e) {
      return { error: e };
    }
  }
  static async get(url: string) {
    try {
      const response = await axios.get(this.baseUrl+url, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response?.status === 200) {
        return { data: response.data };
      } else {
        return { error: response?.data?.error };
      }
    } catch (e) {
      return { error: e };
    }
  }
  static async delete(url: string) {
    try {
      const response = await axios.delete(this.baseUrl+url, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response?.status === 200) {
        return { data: response.data };
      } else {
        return { error: response?.data?.error };
      }
    } catch (e) {
      return { error: e };
    }
  }
  static async put(url: string, data: any) {
    try {
      const response = await axios.put(this.baseUrl+url, data, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response?.status === 200) {
        return { data: response.data };
      } else {
        return { error: response?.data?.error };
      }
    } catch (e) {
      return { error: e };
    }
  }
}
