var g59 = {
  brandonvegas: 'Bold Brandon Jones',
  chelciebritt: ' Crazy Dog Lady Chelcie Britt',
  maverickg59: 'Crabby Chris White',
  mktexan: 'Cool Cap Cole Stasney',
  eddycaldes: 'Enthusiastic Eddy Caldes',
  SirGizMo: 'Excited Edwin Ramirez',
  JPMendenhall: 'Joking James Mendenhall',
  Jdulin08: 'Jolly Jason Dulin',
  stroupjason: 'Jumping Jason Stroup',
  JohnHartway: 'Jovial Jonathan Hartway',
  jonathanherring: 'Joyful Jonathan Herring',
  JoscelynJames: 'Jazz Hands Joscelyn James',
  joshnsaunders: 'Job Site Josh Saunders',
  Agentkma: 'Questioning Kevin Anderson',
  KyleReubendale: 'King Kyle Reubendale',
  linda14vasquez: 'Lion Linda Vasquez',
  lnchapin: 'Laughing Lindsay Chapin',
  mairechew: 'Monkey Maire Chew',
  quintanamiriam: 'Messy Hair Miriam Quintana',
  n8biz: 'Nudist Nate Bauer',
  SadatheToure: 'Calm Sadathe Toure',
  crazymaster49: 'Supreme Prince Samuel Conner',
  SKornahrens: "Stomp'n Stephen Kornahrens",
  travisjeremiah: 'Terrific Travis Jerimiah',
  tylert88: 'Tiger Tyler Torres',
  wroth08: 'Wiley Weston Roth',
  zacflorez: 'Zen Zac Florez',
  lzake: 'Zig Zag Zach Lowe'
}
var keys = Object.keys(g59)
var sentry = $('#entry')
var $daNames = $('.danames')
var something = new Awesomplete(document.querySelector("#entry"));

sentry.keyup(_.throttle(function() {

  var entryVal = $('#entry').val()
  var address = "https://api.github.com/search/repositories?q=";
  var endString = "+org:gschool&sort=forks&order=desc"
  var bestAddress = address + entryVal + endString


  $.ajax({
      method: "GET",
      url: bestAddress,
      contentType: "application/json",
      headers: {
        Authorization: "bearer ccd2e2563eb15eb1c6dd248cf7081d3d091d5f04"
      }

    })
    .then(function(data) {
      var qlist = data['items'].map(function(i) {
        return i.name
      })
      something.list = qlist

    })

}, 300, {
  'leading': false
}))

$('button').click(function() {
  event.preventDefault();
  $daNames.empty()
  $daNames.fadeOut(100)
  $daNames.append('<li><h4>These classmates may be able to help!</h4></li>')

  $.ajax({
      method: "POST",
      url: "https://api.github.com/graphql",
      contentType: "application/json",
      headers: {
        Authorization: "bearer ccd2e2563eb15eb1c6dd248cf7081d3d091d5f04"
      },
      data: JSON.stringify({
        query: `query ($entry: String!) {repository(name: $entry, owner: "gschool") {
            pullRequests(last: 100) {
              nodes {
                state
                headRepository {
                  owner {
                    login
                    avatarUrl
                  }
                }
              }
            }
          }
}`,
        variables: {
          "entry": $('#entry').val()
        }
      })
    })
    .done(appendNamesToView(data))

})

function appendNamesToView (data){
  var nodes = data['data']['repository']['pullRequests']['nodes']
  for (var i = 0; i < nodes.length; i++) {
    if (nodes[i]['headRepository'] !== null) {
      for (var j = 0; j < keys.length; j++) {
        if (keys[j] === nodes[i]['headRepository']['owner']['login']) {
          var avatar = nodes[i]['headRepository']['owner']['avatarUrl']
          $daNames.append('<li class="col s12 m12 l12 z-depth-2 ncards row" ><img src="'+ avatar +'" class="circle responsive-img lilimg col s2 m2 l2"><h5 col s11>' + g59[keys[j]] + '</h5></li>').fadeIn(500)
        }
      }
    }

  }

}
