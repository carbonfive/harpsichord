defmodule HarpsichordWeb.DataController do
  use HarpsichordWeb.Web, :controller
  alias HarpsichordWeb.Repo
  alias HarpsichordWeb.ClimateDatum
  alias HarpsichordWeb.AmbientDatum

  def index(conn, _params) do
    data = ClimateDatum.latest |> Repo.one
    render(conn, "index.json", data: data)
  end

  def create(conn, %{"climate" => datum}) do
    changeset = ClimateDatum.changeset(%ClimateDatum{}, datum)

    case Repo.insert(changeset) do
      {:ok, climate_datum} ->
        HarpsichordWeb.Endpoint.broadcast! "data:climate", "new_data", %{datum: %{temperature: climate_datum.temperature, humidity: climate_datum.humidity}}
        render conn, datum: climate_datum
      {:error, changeset} ->
        render conn, datum: "error"
    end
  end

  def create(conn, %{"ambient" => datum}) do
    changeset = AmbientDatum.changeset(%AmbientDatum{}, datum)

    case Repo.insert(changeset) do
      {:ok, ambient_datum} ->
        HarpsichordWeb.Endpoint.broadcast! "data:ambient", "new_data", %{datum: %{light: ambient_datum.light, sound: ambient_datum.sound}}
        render conn, datum: ambient_datum
      {:error, changeset} ->
        render conn, datum: "error"
    end
  end

end
