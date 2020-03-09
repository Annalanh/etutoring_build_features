Cài đặt:
Server: 
npm install --save socket.io
Client: 
npm install --save socket.io-client
https://cdnjs.com/libraries/socket.io
/socket.io/socket.io.js trong server pack

=========

Cơ chế hoạt động

Socket.io hỗ trợ server lắng nghe sự kiện từ client sau đó lại truyền tin về cho client. 
Cần cài đặt io trên cả client lẫn server: Ví dụ, client gửi 1 đoạn chat đi, thì khi đó ở phía server cần viết code để nhận dữ liệu đoạn code đó và truyền dữ liệu chat đó đi đến các client khác. Đồng thời ở ở phía client cũng cần viết code để gửi và nhận dữ liệu từ server.

Code để nhận và gửi dữ liệu là on và emit. On là nghe và emit truyền.
on và emit nhận tham số đầu tiên là tên đường truyền. Ví dụ:
Server: on("channel 1", ()), emit("channel 2", ()) - tức là server sẽ nghe sự kiện ở channel 1 và truyền đi ở channel 2
Client: on("channel 2, ()), emit("channel 1", ()) - tức là nếu muốn client giao tiếp với server thì client phải truyền đi ở channel 2(vì server nó nghe ở channel 2), còn lắng nghe ở channel 1 (vì server truyền đi ở channel 1)

Broadcast là gì: nếu chỉ emit thì gửi hết cho mọi người lắng nghe channel. Thêm broadcast là gửi cho những người lắng nghe channel ngoại trừ thằng gây ra sự kiện

========