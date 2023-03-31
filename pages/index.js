import {
  Alert,
  Button,
  Card,
  Col,
  Form,
  Input,
  message,
  Row,
  Spin,
} from "antd";
import React, { Fragment, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import axios from "axios";

export default function Home() {
  const router = useRouter();
  const { code } = router.query;
console.log(code)
  const [whenSuccess, setWhenSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const onFinish = async (values) => {
    setIsLoading(true);
    try {
      if (values.password === values.confirmpassword) {
        console.log(isLoading)
        // Request API.
console.log([values.password,values.confirmpassword])
        axios
          .post(
            `${process.env.NEXT_PUBLIC_BACKEND_LINK}${process.env.NEXT_PUBLIC_RESET_PASSWORD_API}`,
            {
              code: code, // code contained in the reset link of step 3.
              password: values.password,
              passwordConfirmation: values.confirmpassword,
            }
          )
          .then((response) => {
            setWhenSuccess(true);
            message.success(`Password changed successfully`);
            console.log("Your user's password has been reset.");
          })
          .catch((error) => {
            message.error("failed to reset password");
            console.log("An error occurred:", error.response);
          });
      } else {
        message.error(`Password and Confirm Password should be same`);
      }
    } catch (error) {
      message.error(`Something went wrong`);
      console.error(error);
      setError(error?.message ?? "Something went wrong!");
    } finally {
      setIsLoading(false);
    }
  };


  return (
    <>
      <div className="bg-black h-[100%]">
       {!code &&<div className="text-white text-center font-bold ">
          <h2>Token expired</h2>
        </div>}

        {code && (
          <div>
            {!whenSuccess && (
              <Fragment>
                <Row
                  align="middle"
                  className="flex justify-center items-center"
                >
                  <Col
                    className={`w-[300px] md:w-[400px] lg:w-[500px] justify-center`}
                  >
                    <Card title="Enter new password">
                      {error ? (
                        <Alert
                          className="alert_error"
                          message={error}
                          type="error"
                          closable
                          afterClose={() => setError("")}
                        />
                      ) : null}
                      <Form
                        name="basic"
                        layout="vertical"
                        onFinish={onFinish}
                        autoComplete="off"
                      >
                        <Form.Item
                          label="Password"
                          name="password"
                          rules={[
                            {
                              required: true,
                              type: "password",
                              max: 10,
                              min: 3,
                            },
                          ]}
                        >
                          <Input placeholder="Password" required minLength={6} />
                        </Form.Item>
                        <Form.Item
                          label="Confirmpassword"
                          name="confirmpassword"
                          rules={[
                            {
                              required: true,
                              type: "password",
                            },
                          ]}
                        >
                          <Input
                            placeholder="Confirm password"
                            required
                            min="6"
                          />
                        </Form.Item>


                        <Form.Item>
                          <Button
                            type="primary"
                            htmlType="submit"
                            className="login_submit_btn text-blue-600 border-2 border-blue-600"
                          >
                            Submit{" "}
                            {isLoading && (
                              <Spin className="pl-2" size="small" />
                            )}
                          </Button>
                        </Form.Item>
                      </Form>
                    </Card>
                  </Col>
                </Row>
              </Fragment>
            )}

            {/* when password successfully changed */}
            {whenSuccess && (
              <div className="w-[100%] h-[100%] bg-green-900 text-center py-10 text-white ">
                <h2 className="font-bold text-lg my-3">
                  Password changed successfully
                </h2>
                <Link
                  className="my-3 px-3 py-2 bg-yellow-900"
                  href={"https://digital-shop.onrender.com"}
                >
                  Go to Digital shop
                </Link>
              </div>
            )}
            <Link className="text-red-800" href={"/forgotpassword"}>
              forgotpassword
            </Link>
          </div>
        )}
      </div>
    </>
  );
}
