import { ChangeEvent, FormEvent, useState } from "react";
import CryptoJS from "crypto-js";
import { v4 as uuid } from "uuid";
import storage from "../../storage";
import { UserData } from "../../types";

import styles from "./styles.module.css";

const PASSPHRASE_STORAGE_KEY = "passphrase";

type LoginPageProps = {
  setUserData: (userData: UserData) => void;
};

export function LoginPage({ setUserData }: LoginPageProps) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorText, setErrorText] = useState("");

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    const encryptedPassphrase = storage.get<string | undefined>(
      `${username}:${PASSPHRASE_STORAGE_KEY}`,
    );

    if (!encryptedPassphrase) {
      const passphrase = uuid();

      storage.set(
        `${username}:${PASSPHRASE_STORAGE_KEY}`,
        CryptoJS.AES.encrypt(passphrase, password).toString(),
      );
      setUserData({ username, passphrase });
      return;
    }

    const passphrase = CryptoJS.AES.decrypt(
      encryptedPassphrase,
      password,
    ).toString(CryptoJS.enc.Utf8);

    if (passphrase) {
      setUserData({ username, passphrase });
    } else {
      setErrorText("Invalid credentials for existing user");
    }
  };

  const handleChangeUsername = (e: ChangeEvent<HTMLInputElement>) => {
    setUsername(e.target.value);
  };

  const handleChangePassword = (e: ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

  return (
    <div className={styles.pageContainer}>
      <form className={styles.loginContainer} onSubmit={handleSubmit}>
        {errorText}
        <label>
          <div className={styles.labelText}>Username</div>
          <input
            name="username"
            type="text"
            className={styles.textField}
            onChange={handleChangeUsername}
            value={username}
          />
        </label>
        <label>
          <div className={styles.labelText}>Password</div>
          <input
            name="username"
            type="password"
            className={styles.textField}
            onChange={handleChangePassword}
            value={password}
          />
        </label>
        <button type="submit" className={styles.button}>
          Login
        </button>
      </form>
    </div>
  );
}
