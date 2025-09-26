import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import axios from "axios";
import { useAuth } from "../../../context/authContext";

export default function AdminSettings() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [policyFile, setPolicyFile] = useState(null);
  const [policies, setPolicies] = useState([]);
  const {user}=useAuth()
  const id=user._id

  // Fetch uploaded policies on load
  useEffect(() => {
    axios.get("http://localhost:3000/api/policy")
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
      console.log("password",password)
      await axios.put("http://localhost:3000/api/policy/reset-password", {
        id,password,
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

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="w-full max-w-3xl p-6 bg-white rounded-2xl shadow-lg">
        <h1 className="text-2xl font-bold mb-6 text-center">⚙️ Admin Settings</h1>

        <Tabs defaultValue="policies" className="space-y-6">
          <TabsList className="flex justify-center">
            <TabsTrigger value="policies">📄 Policies</TabsTrigger>
            <TabsTrigger value="security">🔑 Reset Password</TabsTrigger>
          </TabsList>

          {/* Policies Section */}
          <TabsContent value="policies">
            <Card className="shadow-md rounded-2xl">
              <CardHeader>
                <CardTitle>Upload Policies</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Input
                  type="file"
                  onChange={(e) => setPolicyFile(e.target.files[0])}
                />
                <Button onClick={handleUploadPolicy} className="w-full mt-6">
                  Upload Policy
                </Button>

           
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
          <label className="block text-sm font-medium">New Password</label>
          <Input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            name="newPassword" 
           
          />
        </div>
        <div>
          <label className="block pt-4 text-sm font-medium">Confirm Password</label>
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

        </Tabs>
      </div>
    </div>
  );
}
