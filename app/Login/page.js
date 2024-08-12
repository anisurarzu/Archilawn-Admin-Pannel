"use client";

import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { Input, Button } from "antd";
import { useRouter } from "next/navigation";
import Image from "next/image";

const Login = () => {
  const router = useRouter();

  const validationSchema = Yup.object({
    email: Yup.string().email("Invalid email address").required("Required"),
    password: Yup.string()
      .min(6, "Password must be at least 6 characters")
      .required("Required"),
  });

  const handleSubmit = (values, { setSubmitting }) => {
    setSubmitting(false);
    // Mock login
    console.log(values);
    router.push("/dashboard"); // Redirect after login
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 relative">
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/bg-01.jpg"
          alt="Architecture Background"
          layout="fill"
          objectFit="cover"
          quality={100}
        />
      </div>
      <div className="bg-white bg-opacity-90 p-8 rounded-lg shadow-lg max-w-lg w-full z-10">
        <h2 className="text-3xl font-semibold text-center text-gray-800 mb-8">
          Login
        </h2>
        <Formik
          initialValues={{ email: "", password: "" }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}>
          {({ isSubmitting }) => (
            <Form className="space-y-8">
              <div>
                <label
                  htmlFor="email"
                  className="block text-gray-700 font-medium mb-2">
                  Email
                </label>
                <Field
                  name="email"
                  type="email"
                  as={Input}
                  placeholder="Enter your email"
                  className="p-4 rounded-lg border-gray-300 focus:ring-2 focus:ring-[#8ABF55] focus:border-transparent w-full"
                  size="large"
                />
                <ErrorMessage
                  name="email"
                  component="div"
                  className="text-red-500 text-sm mt-2"
                />
              </div>
              <div>
                <label
                  htmlFor="password"
                  className="block text-gray-700 font-medium mb-2">
                  Password
                </label>
                <Field
                  name="password"
                  type="password"
                  as={Input.Password}
                  placeholder="Enter your password"
                  className="p-4 rounded-lg border-gray-300 focus:ring-2 focus:ring-[#8ABF55] focus:border-transparent w-full"
                  size="large"
                />
                <ErrorMessage
                  name="password"
                  component="div"
                  className="text-red-500 text-sm mt-2"
                />
              </div>
              <Button
                type="primary"
                htmlType="submit"
                loading={isSubmitting}
                className="w-full py-4 bg-[#8ABF55] hover:bg-[#7DA54E] border-none text-white text-lg rounded-lg">
                Login
              </Button>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default Login;
