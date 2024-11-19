import React from "react";
import { useRouteError } from "react-router-dom";

const ErrorPage = () => {
  const error = useRouteError();

  console.error(error);
  console.log(error);

  return (
    <div>
      <h1>Não encontrado. volte para o início</h1>
    </div>
  );
};

export default ErrorPage;
