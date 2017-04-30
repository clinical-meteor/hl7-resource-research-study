import { Card, CardActions, CardMedia, CardText, CardTitle } from 'react-toolbox/lib/card';

import { Accounts } from 'meteor/accounts-base';
import AppBar from 'react-toolbox/lib/app_bar';
import Avatar from 'react-toolbox/lib/avatar';
import Button from 'react-toolbox/lib/button';
import { Meteor } from 'meteor/meteor';
import React from 'react';
import { ReactMeteorData } from 'meteor/react-meteor-data';
import ReactMixin from 'react-mixin';
import { Table } from 'react-bootstrap';
import TextField from 'material-ui/TextField';

Session.setDefault('patientSearchFilter', '');
Session.setDefault('selectedResearchStudyId', '');

export default class ResearchStudyTable extends React.Component {

  getMeteorData() {

    // this should all be handled by props
    // or a mixin!
    let data = {
      style: {
        opacity: Session.get('globalOpacity')
      },
      selected: [],
      showSearch: false,
      patients: ResearchStudies.find({'name.text': {
        $regex: Session.get('patientSearchFilter'),
        $options: 'i'
      }}, {limit: this.props.limit}).map(function(person){
        return {
          _id: person._id,
          active: person.active.toString(),
          gender: person.gender,
          name: person.name ? person.name[0].text : "",
          birthdate: moment(person.birthDate).format("YYYY-MM-DD"),
          photo: person.photo ? person.photo[0].url: ""
        };
      })
    };

    if (Session.get('darkroomEnabled')) {
      data.style.color = "black";
      data.style.background = "white";
    } else {
      data.style.color = "white";
      data.style.background = "black";
    }

    // this could be another mixin
    if (Session.get('glassBlurEnabled')) {
      data.style.filter = "blur(3px)";
      data.style.webkitFilter = "blur(3px)";
    }

    // this could be another mixin
    if (Session.get('backgroundBlurEnabled')) {
      data.style.backdropFilter = "blur(5px)";
    }

    if (this.props.showSearch) {
      data.showSearch = this.props.showSearch;
    }
    if (!Session.equals('selectedResearchStudyId', '')) {
      data.showSearch = false;
    } else {
      data.showSearch = true;
    }

    return data;
  }


  rowClick(id, name){
    // set the user
    //Session.set("selectedResearchStudyId", id);

    // if a selected row is clicked again, unselect it
    if (Session.equals('selectedResearchStudyId', id)) {
      Session.set("selectedResearchStudyId", '');
    } else {
      // otherwise, update the select row to whatever was just clicked
      Session.set("selectedResearchStudyId", id);
    }

    if (Session.equals('patientSearchFilter', name)) {
      Session.set("patientSearchFilter", '');
    } else {
      Session.set("patientSearchFilter", name);
    }

    // set which tab is selected
    let state = Session.get('patientCardState');
    state["index"] = 2;
    Session.set('patientCardState', state);
  }
  renderAvatar(i){
    if (!this.props.hideAvatar) {
      return (
        <td>
          <Avatar><img src={this.data.patients[i].photo }/></Avatar>
        </td>
      );
    }
  }
  renderAvatarHeader(){
    if (!this.props.hideAvatar) {
      return (<th>photo</th>);
    }
  }
  renderResearchStudySearch(){
    if (this.data.showSearch) {
      return (
        <TextField
          id="patientSearchInput"
          floatingLabelText="Search patients..."
          floatingLabelStyle={{color: 'lightgray'}}
          fullWidth={true}
          onChange={this.setSearchFilter}
        />
      );
    }
  }
  setSearchFilter(event){
    console.log("setSearchFilter", event.target.value);
    Session.set('patientSearchFilter', event.target.value);
  }
  render () {
    let tableRows = [];
    console.log("this.data.patients.length", this.data.patients.length);

    for (var i = 0; i < this.data.patients.length; i++) {
      tableRows.push(
        <tr key={i} className="patientRow" style={{cursor: "pointer"}} onClick={ this.rowClick.bind('this', this.data.patients[i]._id, this.data.patients[i].name)} >
          {this.renderAvatar(i)}
          <td>{this.data.patients[i].name }</td>
          <td>{this.data.patients[i].gender}</td>
          <td>{this.data.patients[i].birthdate }</td>
          <td className='hidden-on-phone'>{this.data.patients[i].active}</td>
          <td className='hidden-on-phone'><span className="barcode">{this.data.patients[i]._id}</span></td>
        </tr>
      );
    }


    return(
      <div>
        {this.renderResearchStudySearch() }
        <Table responses hover >
          <thead>
            <tr>
              {this.renderAvatarHeader}
              <th>name</th>
              <th>gender</th>
              <th>birthdate</th>
              <th className='hidden-on-phone'>active</th>
              <th className='hidden-on-phone'>user._id</th>
            </tr>
          </thead>
          <tbody>
            { tableRows }
          </tbody>
        </Table>
      </div>
    );
  }
}


ResearchStudyTable.propTypes = {};
ReactMixin(ResearchStudyTable.prototype, ReactMeteorData);
