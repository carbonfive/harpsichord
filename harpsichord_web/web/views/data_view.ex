defmodule HarpsichordWeb.DataView do
  use HarpsichordWeb.Web, :view

  @attributes ~w(id temperature humidity)a

  def render("index.json", %{data: data}) do
    data
    |> encode
  end

  def render("create.json", %{datum: datum}) do
    datum
    |> encode
  end

  defp encode(datum) do
    datum
    |> Map.take(@attributes)
  end
end
