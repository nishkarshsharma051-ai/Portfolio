import json

files_to_find = ["src/components/HeroScene.tsx", "src/components/DevTitleScene.tsx", "src/components/TimelineScene.tsx", "src/components/ProjectsScene.tsx", "src/components/AnimatedBackground.tsx", "src/pages/Home.tsx"]

extracted = {}

with open("/Users/nishkarshsharma/.gemini/antigravity-ide/brain/979acd93-2942-4633-8ce8-5e560d9d68c1/.system_generated/logs/transcript.jsonl", "r") as f:
    for line in f:
        try:
            data = json.loads(line)
            if "tool_calls" in data:
                for call in data["tool_calls"]:
                    if call["name"] == "write_to_file" or call["name"] == "multi_replace_file_content":
                        args = call.get("args", {})
                        if isinstance(args, str):
                            try:
                                args = json.loads(args)
                            except:
                                pass
                        
                        target_file = args.get("TargetFile", "")
                        for wanted in files_to_find:
                            if wanted in target_file:
                                if call["name"] == "write_to_file":
                                    extracted[wanted] = args.get("CodeContent", "")
        except:
            pass

for f, content in extracted.items():
    print(f"--- Found {f} --- (Length: {len(content)})")
    with open(f"extracted_{f.split('/')[-1]}", "w") as out:
        out.write(content)

