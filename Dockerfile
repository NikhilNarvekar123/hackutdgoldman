FROM python:3.11

ENV PORT 8080

WORKDIR /server/

COPY ./server/ /server/

RUN pip3 install --no-cache-dir --upgrade -r /server/requirements.txt

CMD ["uvicorn", "api:app", "--host", "0.0.0.0", "--port", "8080"]