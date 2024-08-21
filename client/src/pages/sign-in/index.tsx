import { useForm, SubmitHandler } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import "../../App.css";
import { PEOPLES_IMAGES } from "../../images";
import Cookies from "universal-cookie";
import { StreamVideoClient, User } from "@stream-io/video-react-sdk";
import { useUser } from "../../user-context";
import { useNavigate } from "react-router-dom";

interface FormValues {
  username: string;
  name: string;
}

export const SignIn = () => {
  const cookies = new Cookies();

  const { setClient, setUser } = useUser();

  const navigate = useNavigate();

  const schema = yup.object().shape({
    username: yup
      .string()
      .required("Username is required")
      .matches(/^[a-zA-z0-9_.@$]+$/, "Invalid username"),
    name: yup.string().required("Name is required"),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({ resolver: yupResolver(schema) });

  const onSubmit: SubmitHandler<FormValues> = async (data, event) => {
    event?.preventDefault();
    const { username, name } = data;
    console.log(username, name);
    const response = await fetch("http://localhost:4000/auth/createUser", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username,
        name,
        image:
          PEOPLES_IMAGES[Math.floor(Math.random() * PEOPLES_IMAGES.length)],
      }),
    });

    if (!response.ok) {
      alert("Some error occured while signing in");
    }

    const responseData = await response.json();
    console.log(responseData);

    const user: User = {
      id: username,
      name,
    };

    const myClient = new StreamVideoClient({
      apiKey: "75wmnau69aht",
      user,
      token: responseData.token,
    });
    setClient(myClient);
    setUser({ username, name });

    const expires = new Date();
    expires.setDate(expires.getDate() + 1);
    cookies.set("token", responseData.token, {
      expires,
    });
    cookies.set("username", responseData.username, {
      expires,
    });
    cookies.set("name", responseData.name, {
      expires,
    });
    navigate("/");
  };

  return (
    <div className="home">
      <h1>Welcome to Clubhouse 2.0</h1>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div>
          <label>Username: </label>
          <input type="text" {...register("username")} />
          {errors.username && (
            <p style={{ color: "red" }}>{errors.username.message}</p>
          )}
        </div>
        <div>
          <label>Name: </label>
          <input type="text" {...register("name")} />
          {errors.name && <p style={{ color: "red" }}>{errors.name.message}</p>}
        </div>
        <button type="submit">Sign In</button>
      </form>
    </div>
  );
};
