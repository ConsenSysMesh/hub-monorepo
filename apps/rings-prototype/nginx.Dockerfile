FROM nginx:1.16.0

ARG env=development

RUN rm /etc/nginx/nginx.conf
COPY ./packages/config/${env}/nginx.conf /etc/nginx/nginx.conf