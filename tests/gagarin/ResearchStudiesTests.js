describe('clinical:hl7-resources-research-study', function () {
  var server = meteor();
  var client = browser(server);

  it('ResearchStudies should exist on the client', function () {
    return client.execute(function () {
      expect(ResearchStudies).to.exist;
    });
  });

  it('ResearchStudies should exist on the server', function () {
    return server.execute(function () {
      expect(ResearchStudies).to.exist;
    });
  });

});
