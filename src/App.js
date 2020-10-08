import React, { Component } from "react";
class App extends Component {
  constructor() {
    super();
    this.state = {
        items: [],
        isLoaded: false,
        city: "all",
        stateSymbol: "all",
        genre: "all",
        txtBoxValue: "",
        searchKey : ""
    };
    this.handleChange = this.handleChange.bind(this);
  }
  handleChange(event) {
      const { name, value, type, checked } = event.target;
      type === "checkbox"
        ? this.setState({
            [name]: checked
          })
        : this.setState({
            [name]: value
          });
  }

  componentDidMount() {
      var myHeaders = new Headers();
      myHeaders.append("Authorization", "Api-Key q3MNxtfep8Gt");

      var requestOptions = {
        method: "GET",
        headers: myHeaders,
        redirect: "follow"
      };

      fetch(
        "https://code-challenge.spectrumtoolbox.com/api/restaurants",
        requestOptions
      )
          .then((response) => response.text())
          .then((result) => {
            this.setState({ items: JSON.parse(result), isLoaded: true });
          })
          .catch((error) => console.log("error", error));
  }
  render() {
    var stateArray = Array.from(
      new Set(this.state.items.map((pr) => pr.state))
    ).map((pr) => (
      <option value={pr} key={pr}>
        {pr}
      </option>
    ));
    var city = Array.from(new Set(this.state.items.map((pr) => pr.city))).map(
      (pr) => (
        <option value={pr} key={pr}>
          {pr}
        </option>
      )
    );

    var genre = [];
    if (this.state.isLoaded) {
      var uniqueList = new Set();

      this.state.items.forEach((p) =>
        p.genre.split(",").forEach((pr) => uniqueList.add(pr))
      );
      uniqueList.forEach((u) =>
        genre.push(
          <option key={u} value={u}>
            {u}
          </option>
        )
      );
    }

    return (
      <div>
        <label>State</label>
        <select
          className="browser-default"
          onChange={(e) => this.setState({ stateSymbol: e.target.value })}
        >
          <option value="all" key={"all"}>
            All
          </option>
          {stateArray}
        </select>
        <label>City</label>
        <select
          className="browser-default"
          onChange={(e) => this.setState({ city: e.target.value })}
        >
          <option value="all" key={"all"}>
            All
          </option>
          {city}
        </select>

        <label>Genre</label>
        <select
          className="browser-default"
          onChange={(e) => this.setState({ genre: e.target.value })}
        >
          <option value="all" key={"all"}>
            All
          </option>
          {genre}
        </select>
        <br />
        <input
          type="text"
          value={this.state.txtBoxValue}
          onChange={(e) => this.setState({ txtBoxValue: e.target.value.toLowerCase()})}
        />
        <input type="button" value="Search" onClick={()=>this.setState({searchKey:this.state.txtBoxValue})} />
        <input type="button" value="Clear Search" onClick={()=>this.setState({searchKey:"",txtBoxValue:""})} />
        <ul>
          {this.state.isLoaded
            ? this.state.items
                .filter(
                  (i) =>
                    (this.state.genre === "all" ||
                      i.genre.includes(this.state.genre)) &&
                    (this.state.stateSymbol === "all" ||
                      i.state.includes(this.state.stateSymbol)) &&
                    (this.state.city === "all" ||
                      i.city.includes(this.state.city)) &&
                    (this.state.txtBoxValue === "" ||
                      i.city.toLowerCase().includes(this.state.searchKey) ||
                      i.genre.toLowerCase().includes(this.state.searchKey) ||
                      i.name.toLowerCase().includes(this.state.searchKey))
                )
                .map((person) => (
                  <li key={person.id}>
                    <h2>{person.name}</h2>
                    <p>
                      place : {person.city}-{person.state}
                    </p>
                    <p>phone number: {person.telephone}</p>
                    <p>genre: {person.genre}</p>
                    <p>website :{person.website}</p>
                  </li>
                ))
            : "loading..."}
        </ul>
      </div>
    );
  }
}

export default App;
