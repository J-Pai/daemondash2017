FROM jpai/nodejs_basic
RUN git clone https://github.com/J-Pai/daemondash2017
RUN cd info_server && npm install
CMD cd info_server && npm start
