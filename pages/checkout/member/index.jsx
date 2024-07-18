import { setEmail } from "@/features/userSlice/userSlice";
import Link from "next/link";
import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import Image from "next/image";

const importScript = src => {
  const credScript = document.createElement('script');
  credScript.type = 'text/javascript';
  credScript.innerHTML = `
  window.handleCredentialResponse = async (response) => {
      const data = JSON.stringify({data:response});

      await fetch('/api/addSession', {
          method: 'POST',
          headers: {
                  'Content-Type': 'application/json',
              },
          body: data,
      });

      window.location.href = '/checkout/shipping';
  }
  `;
  document.head.appendChild(credScript);
  const script = document.createElement('script')
  script.src = src
  script.async = true
  document.body.appendChild(script)
}

const Input = ({ label, placeholder, type, name, value, onChange }) => {
  const [isVisible, setIsVisible] = useState(false);

  return (
      <div className="w-full flex flex-col gap-y-3">
          <label className="text-2xl leading-6 capitalize font-normal text-[#070707]">
              {label}
          </label>
          <div className="w-full text-base px-4 py-3 leading-[25.6px] rounded-[84px] border-[1px] border-[#070707] text-[#070707] bg-[#FFFFFF] font-medium flex gap-5 justify-between">
              <input
                  className="w-full h-fit text-base focus:outline-none"
                  placeholder={placeholder}
                  type={isVisible ? "text" : type}
                  name={name}
                  value={value}
                  onChange={onChange}
              />
              {type === "password" && (
                  <Image
                      className="cursor-pointer"
                      onClick={() => setIsVisible(!isVisible)}
                      src="/eye.svg"
                      alt="eye"
                      width={24}
                      height={24}
                  />
              )}
          </div>
      </div>
  );
};


const Signin = () => {
  useEffect(() => {
    importScript("https://accounts.google.com/gsi/client");
  }, []);

  const [buttonText, setButtonText] = useState('Log In');
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
      email: '',
      password: ''
  });
  const [error, setError] = useState(false);

  const handleChange = (e) => {
      const { name, value } = e.target;
      setFormData((prevData) => ({
          ...prevData,
          [name]: value
      }));
  };

  const handleSubmit = async (e) => {
    setButtonText('Logging In...');
    setError(false);
    e.preventDefault();
    const form = new FormData();
    form.append('email', formData.email);
    form.append('password', formData.password);

    try {
        const response = await fetch('/api/pwdLogin', {
            method: 'POST',
            body: form
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        if (response.status === 200) {
            dispatch(setEmail(formData.email));
            window.location.href = '/checkout/shipping';
        } else {
            setError('Invalid Credentials')
            setButtonText('Log in');
        }

    } catch (error) {
        setButtonText('Log In');
        console.error('Error submitting form:', error);
    }
  }
  return (
    <div className="mb-[95px] sm:mb-[58px] xl:mb-[105px] w-full px-11 sm:px-0 flex flex-col justify-center items-center">
      {/* Title */}
      <div className="max-w-[560px] w-full flex flex-col gap-y-3">
        <p className="text-[32px] leading-8 font-normal capitalize text-[#070707]">
          Welcome back
        </p>
        <p className="w-[266px] sm:w-full text-sm leading-[22.4px] font-medium text-[#8E8F94]">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit.
        </p>
      </div>

      {/* Google and Apple Authentication */}
      <div className="mt-[42px] sm:mt-[52px] w-full flex flex-col justify-center sm:flex-row gap-y-4 sm:gap-x-4">
        <script></script>
        <div id="g_id_onload"
            data-client_id="704145836182-04mlgm7nhg2n4sjqno7vlh172427g778.apps.googleusercontent.com"
            data-context="signin"
            data-ux_mode="popup"
            data-callback="handleCredentialResponse"
            data-auto_prompt="false">
        </div>

        <div class="g_id_signin"
            data-type="standard"
            data-shape="pill"
            data-theme="outline"
            data-text="signin_with"
            data-size="large"
            data-logo_alignment="center"
            data-width="400">
        </div>
      </div>

      {/* Or */}
      <div className="my-8 max-w-[560px] w-full flex gap-x-2 items-center">
        <div className="w-full h-[1px] bg-[#E4E4E4]" />
        <p className="text-base leading-[25.6px] font-medium text-[#070707]">
          or
        </p>
        <div className="w-full h-[1px] bg-[#E4E4E4]" />
      </div>

      {/* Form */}
      <div className="w-full max-w-[560px]">
          <form className="w-full flex flex-col gap-y-6" onSubmit={handleSubmit}>
              <Input
                label="Email"
                placeholder="Type here"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
              />
              <Input
                  label="Password"
                  placeholder="Type here"
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
              />

              {error && <p className="text-red-600 mt-2">{error}</p>}

              <button
                  type="submit"
                  className="mt-[42px] sm:mt-[52px] w-full text-base px-6 py-[17px] rounded-[30px] border-[1px] bg-[#070707] border-[#070707] text-[#FFFFFF] font-[600]"
              >
                  {buttonText}
              </button>

              <p className="mt-4 sm:mt-6 text-sm leading-[18.2px] text-[#8E8F94] font-medium text-center">
                  Don’t have an account?
                  <Link href="/signup">
                      <span className="text-[#070707]"> Sign Up</span>
                  </Link>
              </p>
          </form>
      </div>
    </div>
  );
};

export default Signin;