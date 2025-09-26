import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import axios from "axios";
import { useAuth } from "../../../context/authContext";

export default function EmployeeSettings() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [policyFile, setPolicyFile] = useState(null);
  const [policies, setPolicies] = useState([]);
  const [file,setFile]=useState("")
  const {user} = useAuth();
  const id= user._id;

  // Fetch uploaded policies on load
  useEffect(() => {
    axios
      .get("http://localhost:3000/api/policy")
      .then((res) => setPolicies(res.data))
      .catch((err) => console.error(err));
  }, []);

  // Reset password
  const handleResetPassword = async () => {
    if (password !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }
    try {
      console.log("password", password);
      await axios.put("http://localhost:3000/api/policy/reset-password", {
        id,
        password,
      });
      alert("Password updated successfully!");
      setPassword("");
      setConfirmPassword("");
    } catch (err) {
      console.error(err);
      alert("Error updating password!");
    }
  };

  // Upload policy
  const handleUploadPolicy = async () => {
    if (!policyFile) {
      alert("Please select a file to upload");
      return;
    }
    const formData = new FormData();
    formData.append("file", policyFile);

    try {
      const res = await axios.post(
        "http://localhost:3000/api/policy/upload",
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
      alert("Policy uploaded successfully!");
      setPolicies([...policies, res.data]);
    } catch (err) {
      console.error(err);
      alert("Error uploading policy!");
    }
  };

  const handleSubmit = async (e) => {
  e.preventDefault();
  const formData = new FormData();
  formData.append("image", file);
  console.log("id send for update",id)

  const res = await axios.put(
    `http://localhost:3000/api/employee/photo/${id}`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    }
  );

  if (res.data.success) {
    alert("Photo updated!");
  }
};


const [form, setForm] = useState({
    accountNumber: "",
    ifscCode: "",
    bankName: "",
    branch: "",
  });

  useEffect(() => {
    // Fetch existing details
    axios.get("/").then((res) => {
      if (res.data.bankDetails) setForm(res.data.bankDetails);
    });
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmitBankDetail = async (e) => {
    e.preventDefault();
    await axios.put(`http://localhost:3000/api/salary/addBankDetail/${id}`, form);
    alert("Bank details updated!");
    setForm({
    accountNumber: "",
    ifscCode: "",
    bankName: "",
    branch: "",
  });
  };



  return (
    <div className="flex items-center justify-center min-h-157 bg-gray-50">
      <div className="w-full max-w-3xl p-6 bg-white rounded-2xl shadow-lg">
        <h1 className="text-2xl font-bold mb-6 text-center">
          ⚙️ Employee Settings
        </h1>

        <Tabs defaultValue="policies" className="space-y-6">
          <TabsList className="flex justify-center">
            <TabsTrigger value="policies">📄 Policies</TabsTrigger>
            <TabsTrigger value="security">🔑 Reset Password</TabsTrigger>
            <TabsTrigger value="update">🔑 Update Profile Photo</TabsTrigger>
            <TabsTrigger value="updateBankDetail">🔑 Update Bank Detail</TabsTrigger>
          </TabsList>

          {/* Policies Section */}
          <TabsContent value="policies">
            <Card className="shadow-md rounded-2xl">
              <CardHeader>
                <CardTitle>Company Policies</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {policies.length === 0 && <p>No policies available.</p>}
                {policies.map((policy) => (
                  <Button
                    key={policy._id}
                    onClick={() => window.open(policy.url, "_blank")}
                    className="w-full mt-4"
                  >
                    {policy.name}
                  </Button>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Reset Password Section */}
          <TabsContent value="security">
            <Card className="shadow-md rounded-2xl">
              <CardHeader>
                <CardTitle>Reset Password</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <form
                  onSubmit={(e) => {
                    e.preventDefault(); 
                    handleResetPassword(); 
                  }}
                >
                  <div>
                    <label className="block text-sm font-medium">
                      New Password
                    </label>
                    <Input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      name="newPassword"
                    />
                  </div>
                  <div>
                    <label className="block pt-4 text-sm font-medium">
                      Confirm Password
                    </label>
                    <Input
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      name="confirmPassword"
                    />
                  </div>
                  <Button type="submit" className="mt-4 w-full">
                    Update Password
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>


           <TabsContent value="update">
            <Card className="shadow-md rounded-2xl">
              <CardHeader>
                <CardTitle>Update Profile Photo</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <form
                  onSubmit={handleSubmit}
                >
                  <div>
                     <label className="block text-sm font-medium text-gray-700">
              Upload Image
            </label>
            <input
              type="file"
              name="image"
              placeholder="Upload Image"
              onChange={(e) => setFile(e.target.files[0])}
              className="mt-1 p-2 block w-full border border-gray-300 rounded-md"
            />
                  </div>
                  <div>
                  </div>
                  <Button type="submit" className="mt-4 w-full">
                    Update Photo
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="updateBankDetail">
            <Card className="shadow-md rounded-2xl">
              <CardHeader>
                <CardTitle>Update Bank Detail</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
               <form onSubmit={handleSubmitBankDetail} className="space-y-4">
        <input
          type="text"
          name="accountNumber"
          placeholder="Account Number"
          value={form.accountNumber}
          onChange={handleChange}
          className="w-full border p-2 rounded"
          required
        />
        <input
          type="text"
          name="ifscCode"
          placeholder="IFSC Code"
          value={form.ifscCode}
          onChange={handleChange}
          className="w-full border p-2 rounded"
          required
        />
        <input
          type="text"
          name="bankName"
          placeholder="Bank Name"
          value={form.bankName}
          onChange={handleChange}
          className="w-full border p-2 rounded"
          required
        />
        <input
          type="text"
          name="branch"
          placeholder="Branch"
          value={form.branch}
          onChange={handleChange}
          className="w-full border p-2 rounded"
        />
        <button
          type="submit"
          className="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700"
        >
          Save Details
        </button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

        </Tabs>
      </div>
    </div>
  );
}
