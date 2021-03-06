describe('resource', function () {
  var xhr, requests;

  beforeEach(function () {
    xhr = sinon.useFakeXMLHttpRequest();
    requests = [];
    xhr.onCreate = function (req) {
      requests.push(req);
    };
  });
  afterEach(function () {
    resource.clear();
    xhr.restore();
  });

  var resource;

  beforeEach(function () {
    resource = oig.resource('/path');
  });

  it('should make a request to the API', function () {
    resource.load();
    expect(requests.length).to.equal(1);
    expect(requests[0].url).to.equal('/path');
  });

  describe('success', function () {
    describe('should call the callback method', function () {
      var response;
      beforeEach(function () {
        var promise = resource.load().then(function (data) {
          response = data;
        });
        requests[0].respond(200, {'Content-Type': "text/plain"}, 'response');
        return promise;
      });
      it('should return the response', function () {
        expect(response).to.equal('response');
      });
    });

  });

  describe('failure', function () {
    describe('should call the callback method', function () {
      var response;
      beforeEach(function () {
        var promise = resource.load().catch(function (data) {
          response = data;
        });
        requests[0].respond(500, {'Content-Type': "text/plain"}, 'error');
        return promise;
      });
      it('should return the response', function () {
        expect(response).to.equal('error');
      });
    });
  });

  describe('prevent multiple requests', function () {

    beforeEach(function () {
      resource.load();
    })

    it('should make a request to the API', function () {
      expect(requests.length).to.equal(1);
    });

    describe('when data returns', function () {
      var resolved;
      beforeEach(function () {

        resolved = 0;

        resource.load().then(function () {
          resolved++;
        });
        oig.resource('/path').load().then(function () {
          resolved++;
        });
        requests[0].respond(200, {'Content-Type': "text/plain"}, 'response');
        return resource.load();
      });

      it('should call both callbacks', function () {
        expect(resolved).to.equal(2);
      });
    });
  });

});
