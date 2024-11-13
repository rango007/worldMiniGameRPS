# Install ngrok via Chocolatey with the following command:
choco install ngrok

# Run the following command to add your authtoken to the default ngrok.yml configuration file.
ngrok config add-authtoken 2oCJ0BNPa1mIM1q5Z4EpLQCcOye_6egsZopUP4qpbs7iPDSop

..................................................................................................................
# to run app for dev: 

# to run frontend
gto to frontend file and run:
pnpm run dev

# to run backend
gto to backend file and run:
pnpm run dev

# for nginx run below code at C:\Program Files\nginx-1.24.0>
"C:\Program Files\nginx-1.24.0\nginx.exe" -c "C:\Users\kamal\Desktop\kj projects\world mini app\minikit-react-template-main\nginx.conf"

# Put your app online at an ephemeral domain forwarding to your upstream service. For example, if it is listening on port http://localhost:8080, run:
ngrok http http://localhost:8080

..................................................................................................................
