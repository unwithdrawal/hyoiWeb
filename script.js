/* eslint-disable require-jsdoc */
'use strict'

$(function() {
  // Peer object
  const peer = new Peer({
    key:   "bc3292a3-35bd-4289-ac50-359c8100377c",
    debug: 3,
  });

  let localStream;
  let room;
  peer.on('open', () => {
    $('#my-id').text(peer.id);
    // Get things started
    step1();
  });

  peer.on('error', err => {
    alert(err.message);
    // Return to step 2 if error occurs
    step2();
  });

  $('#make-call').on('submit', e => {
    e.preventDefault();
    // Initiate a call!
    const roomName = $('#join-room').val();
    if (!roomName) {
      return;
    }
    room = peer.joinRoom('mesh_multi_' + roomName, {stream: localStream});

    $('#room-id').text(roomName);
    step3(room);
  });

  $('#end-call').on('click', () => {
    $('#chatbox-'+room.name).hide() // 切断時にチャットボックスを隠す
    room.close();
    step2();
  });

  // Retry if getUserMedia fails
  $('#step1-retry').on('click', () => {
    $('#step1-error').hide();
    step1();
  });

  // set up audio and video input selectors
  const audioSelect = $('#audioSource');
  const videoSelect = $('#videoSource');
  const selectors = [audioSelect, videoSelect];

  navigator.mediaDevices.enumerateDevices()
    .then(deviceInfos => {
      const values = selectors.map(select => select.val() || '');
      selectors.forEach(select => {
        const children = select.children(':first');
        while (children.length) {
          select.remove(children);
        }
      });

      for (let i = 0; i !== deviceInfos.length; ++i) {
        const deviceInfo = deviceInfos[i];
        const option = $('<option>').val(deviceInfo.deviceId);

        if (deviceInfo.kind === 'audioinput') {
          option.text(deviceInfo.label ||
            'Microphone ' + (audioSelect.children().length + 1));
          audioSelect.append(option);
        } else if (deviceInfo.kind === 'videoinput') {
          option.text(deviceInfo.label ||
            'Camera ' + (videoSelect.children().length + 1));
          videoSelect.append(option);
        }
      }

      selectors.forEach((select, selectorIndex) => {
        if (Array.prototype.slice.call(select.children()).some(n => {
            return n.value === values[selectorIndex];
          })) {
          select.val(values[selectorIndex]);
        }
      });

      videoSelect.on('change', step1);
      audioSelect.on('change', step1);
    });

  function step1() {
    // Get audio/video stream
    const audioSource = $('#audioSource').val();
    const videoSource = $('#videoSource').val();
    const constraints = {
      audio: {deviceId: audioSource ? {exact: audioSource} : undefined},
      video: {deviceId: videoSource ? {exact: videoSource} : undefined,
      facingMode: "environment"}
    };
    navigator.mediaDevices.getUserMedia(constraints).then(stream => {
      $('#my-video').get(0).srcObject = stream;
      localStream = stream;

      if (room) {
        room.replaceStream(stream);
        return;
      }

      step2();
    }).catch(err => {
      $('#step1-error').show();
      console.error(err);
    });
  }

  function step2() {
    $('#their-videos').empty();
    $('#step1, #step3').hide();
    $('#step2').show();
    $('#join-room').focus();
  }

  function step3(room) {
    // chatboxを追加する
    const chatbox = $('<div></div>').addClass('chatbox').attr('id', 'chatbox-'+room.name);
    const header = $('<h4></h4>').html('Room: <strong>' + room.name + '</strong>');
    const messages = $('<div><em>Peer connected.</em></div>').addClass('messages');
    chatbox.append(header);
    chatbox.append(messages);
    $('#chatframe').append(chatbox);

    // メッセージ送信部分
    $('#sendtextform').on('submit', e => {
      e.preventDefault(); // form送信を抑制
      const msg = $('#mymessage').val();
      // ルームに送って自分のところにも反映
      room.send(msg);
      messages.prepend('<div><span class="you">You: </span>' + msg + '</div>');
      $('#mymessage').val('');
    });

    // チャットとかファイルが飛んできたらdataでonになる
    // ここではファイルは使わないのでもとのサンプルのif文はけしておく
    room.on('data', message => {
      messages.prepend('<div><span class="peer">' + message.src.substr(0,8) + '</span>: ' + message.data + '</div>');
    });

    room.on('peerJoin', peerId => {
      messages.prepend('<div><span class="peer">' + peerId.substr(0,8) + '</span>: has joined the room </div>');
    });

    room.on('peerLeave', peerId => {
      messages.prepend('<div><span class="peer">' + peerId.substr(0,8) + '</span>: has left the room </div>');
    });

    // streamが飛んできたら相手の画面を追加する
    room.on('stream', stream => {
      const peerId = stream.peerId;
      const id = 'video_' + peerId + '_' + stream.id.replace('{', '').replace('}', '');

      $('#their-videos').append($(
        '<div class="video_' + peerId +'" id="' + id + '">' +
          '<label>' + stream.peerId + ':' + stream.id + '</label>' +
          '<video class="remoteVideos" autoplay playsinline>' +
        '</div>'));
      const el = $('#' + id).find('video').get(0);
      el.srcObject = stream;
      el.play();
    });

    room.on('removeStream', function(stream) {
      const peerId = stream.peerId;
      $('#video_' + peerId + '_' + stream.id.replace('{', '').replace('}', '')).remove();
    });

    // UI stuff
    room.on('close', step2);
    room.on('peerLeave', peerId => {
      $('.video_' + peerId).remove();
    });
    $('#step1, #step2').hide();
    $('#step3').show();
  }
});
