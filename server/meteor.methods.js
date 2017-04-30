

Meteor.methods({
  createResearchStudies:function(researchStudyObject){
    check(researchStudyObject, Object);

    if (process.env.NODE_ENV === 'test') {
      console.log('-----------------------------------------');
      console.log('Creating ResearchStudies...');
      ResearchStudies.insert(researchStudyObject, function(error, result){
        if (error) {
          console.log(error);
          if (typeof HipaaLogger === 'object') {
            HipaaLogger.logEvent({
              eventType: "error",
              userId: Meteor.userId(),
              userName: Meteor.user().fullName(),
              collectionName: "ResearchStudies"
            });
          }
        }
        if (result) {
          console.log('ResearchStudies created: ' + result);
          if (typeof HipaaLogger === 'object') {
            HipaaLogger.logEvent({
              eventType: "create",
              userId: Meteor.userId(),
              userName: Meteor.user().fullName(),
              collectionName: "ResearchStudies"
            });
          }
        }
      });
    } else {
      console.log('This command can only be run in a test environment.');
      console.log('Try setting NODE_ENV=test');
    }
  },
  initializeResearchStudies:function(){
    if (ResearchStudies.find().count() === 0) {
      console.log('-----------------------------------------');
      console.log('No records found in ResearchStudies collection.  Lets create some...');

      var defaultResearchStudies = {
        'name' : [
          {
            'text' : 'Jane Doe',
            'resourceType' : 'HumanName'
          }
        ],
        'active' : true,
        'gender' : 'female',
        'identifier' : [
          {
            'use' : 'usual',
            'type' : {
              text: 'Medical record number',
              'coding' : [
                {
                  'system' : 'http://hl7.org/fhir/v2/0203',
                  'code' : 'MR'
                }
              ]
            },
            'system' : 'urn:oid:1.2.36.146.595.217.0.1',
            'value' : '123',
            'period' : {}
          }
        ],
        'birthdate' : new Date(1970, 1, 25),
        'resourceType' : 'ResearchStudies'
      };

      Meteor.call('createResearchStudies', defaultResearchStudies);
    } else {
      console.log('ResearchStudies already exist.  Skipping.');
    }
  },
  dropResearchStudies: function(){
    console.log('-----------------------------------------');
    console.log('Dropping researchStudys... ');

    if (process.env.NODE_ENV === 'test') {
      console.log('-----------------------------------------');
      console.log('Creating ResearchStudies...');
      ResearchStudies.find().forEach(function(researchStudy){
        ResearchStudies.remove({_id: researchStudy._id});
      });
    } else {
      console.log('This command can only be run in a test environment.');
      console.log('Try setting NODE_ENV=test');
    }
  }
});
